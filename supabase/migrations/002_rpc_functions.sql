-- ============================================================================
-- EXTENSION RPC - FONCTIONS CRITIQUES
-- ============================================================================
-- Fichier séparé pour les fonctions RPC (logique métier en BD)
-- À exécuter APRÈS 001_init_schema.sql

-- ============================================================================
-- 1. receive_scan - Réception & création lot
-- ============================================================================

CREATE OR REPLACE FUNCTION receive_scan(
  p_product_code TEXT,
  p_lot_code TEXT,
  p_dlc DATE,
  p_qty INTEGER
)
RETURNS TABLE(
  lot_id UUID,
  message TEXT,
  success BOOLEAN
) AS $$
DECLARE
  v_product_id UUID;
  v_lot_id UUID;
  v_movement_id UUID;
BEGIN
  -- Vérifier produit existe
  SELECT id INTO v_product_id FROM products WHERE product_code = p_product_code;
  IF v_product_id IS NULL THEN
    RETURN QUERY SELECT NULL::UUID, 'Produit introuvable: ' || p_product_code, FALSE;
    RETURN;
  END IF;

  -- Créer le lot (status ARRIVAGE)
  INSERT INTO lots (product_id, lot_code, dlc, status)
  VALUES (v_product_id, p_lot_code, p_dlc, 'ARRIVAGE')
  RETURNING id INTO v_lot_id;

  -- Créer mouvement INBOUND
  INSERT INTO inventory_movements (lot_id, type, from_zone, to_zone, qty)
  VALUES (v_lot_id, 'INBOUND', NULL, 'ARRIVAGE', p_qty);

  -- Créer balance ARRIVAGE
  INSERT INTO inventory_balances (lot_id, zone, qty)
  VALUES (v_lot_id, 'ARRIVAGE', p_qty);

  -- Log événement
  INSERT INTO event_logs (type, payload)
  VALUES ('RECEPTION', jsonb_build_object(
    'product_code', p_product_code,
    'lot_code', p_lot_code,
    'dlc', p_dlc,
    'qty', p_qty,
    'lot_id', v_lot_id
  ));

  RETURN QUERY SELECT v_lot_id, 'Réception créée avec succès', TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 2. allocate_fefo - Allocation FEFO automatique
-- ============================================================================

CREATE OR REPLACE FUNCTION allocate_fefo(p_order_id UUID)
RETURNS TABLE(
  allocations_count INTEGER,
  message TEXT,
  success BOOLEAN
) AS $$
DECLARE
  v_item RECORD;
  v_remaining_qty INTEGER;
  v_lots RECORD;
  v_to_allocate INTEGER;
  v_allocation_count INTEGER := 0;
BEGIN
  -- Récupérer tous les items de la commande
  FOR v_item IN SELECT oi.id, oi.product_id, oi.qty
    FROM order_items oi
    WHERE oi.order_id = p_order_id
  LOOP
    v_remaining_qty := v_item.qty;

    -- Récupérer lots tri par DLC ASC (FEFO)
    FOR v_lots IN
      SELECT l.id, COALESCE(SUM(im.qty), 0) as available_qty
      FROM lots l
      LEFT JOIN inventory_movements im ON l.id = im.lot_id
      WHERE l.product_id = v_item.product_id
        AND l.status NOT IN ('BLOQUE', 'RAPPEL')
      GROUP BY l.id, l.dlc
      ORDER BY l.dlc ASC
    LOOP
      IF v_remaining_qty <= 0 THEN
        EXIT;
      END IF;

      v_to_allocate := LEAST(v_remaining_qty, v_lots.available_qty);

      IF v_to_allocate > 0 THEN
        -- Créer allocation
        INSERT INTO allocations (order_item_id, lot_id, qty, status)
        VALUES (v_item.id, v_lots.id, v_to_allocate, 'RESERVED');

        v_remaining_qty := v_remaining_qty - v_to_allocate;
        v_allocation_count := v_allocation_count + 1;

        -- Log événement
        INSERT INTO event_logs (type, payload)
        VALUES ('ALLOCATION', jsonb_build_object(
          'order_id', p_order_id,
          'product_id', v_item.product_id,
          'lot_id', v_lots.id,
          'qty', v_to_allocate
        ));
      END IF;
    END LOOP;

    -- Si pas assez stock
    IF v_remaining_qty > 0 THEN
      UPDATE orders SET status = 'PARTIALLY_ALLOCATED' WHERE id = p_order_id;
    END IF;
  END LOOP;

  RETURN QUERY SELECT v_allocation_count, 'Allocation FEFO effectuée', TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 3. create_recall_by_dlc_window - Rappel avec fenêtre ±3 jours
-- ============================================================================

CREATE OR REPLACE FUNCTION create_recall_by_dlc_window(
  p_product_id UUID,
  p_dlc_ref DATE,
  p_severity TEXT
)
RETURNS TABLE(
  recall_id UUID,
  lots_affected INTEGER,
  customers_notified INTEGER,
  message TEXT,
  success BOOLEAN
) AS $$
DECLARE
  v_recall_id UUID;
  v_dlc_start DATE;
  v_dlc_end DATE;
  v_lots_count INTEGER := 0;
  v_customers_count INTEGER := 0;
  v_lot RECORD;
  v_customer RECORD;
  v_notification_id UUID;
BEGIN
  -- Calculer fenêtre ±3 jours
  v_dlc_start := p_dlc_ref - INTERVAL '3 days';
  v_dlc_end := p_dlc_ref + INTERVAL '3 days';

  -- Créer rappel
  INSERT INTO recalls (product_id, dlc_ref, dlc_start, dlc_end, severity, status)
  VALUES (p_product_id, p_dlc_ref, v_dlc_start, v_dlc_end, p_severity, 'ACTIVE')
  RETURNING id INTO v_recall_id;

  -- Marquer lots rappelés
  UPDATE lots SET status = 'RAPPEL'
  WHERE product_id = p_product_id
    AND dlc BETWEEN v_dlc_start AND v_dlc_end;

  GET DIAGNOSTICS v_lots_count = ROW_COUNT;

  -- Lier lots au rappel
  INSERT INTO recall_lots (recall_id, lot_id)
  SELECT v_recall_id, id FROM lots
  WHERE product_id = p_product_id
    AND dlc BETWEEN v_dlc_start AND v_dlc_end;

  -- Notifier clients impactés
  FOR v_customer IN
    SELECT DISTINCT c.id
    FROM customers c
    INNER JOIN allocations a ON a.order_item_id IN (
      SELECT oi.id FROM order_items oi
      INNER JOIN orders o ON o.id = oi.order_id
      WHERE o.customer_id = c.id
    )
    INNER JOIN lots l ON l.id = a.lot_id
    WHERE l.product_id = p_product_id
      AND l.dlc BETWEEN v_dlc_start AND v_dlc_end
      AND a.status IN ('PICKED', 'SHIPPED', 'DELIVERED')
  LOOP
    INSERT INTO recall_notifications (recall_id, customer_id, sms_status, email_status, ack_status, escalation_status)
    VALUES (v_recall_id, v_customer.id, 'PENDING', 'PENDING', 'PENDING', 'NONE')
    RETURNING id INTO v_notification_id;

    v_customers_count := v_customers_count + 1;

    -- Simuler SMS + email envoyés
    UPDATE recall_notifications
    SET sms_status = 'SENT', email_status = 'SENT', sent_at = NOW()
    WHERE id = v_notification_id;

    -- Log événement
    INSERT INTO event_logs (type, payload)
    VALUES ('SMS_SENT', jsonb_build_object('customer_id', v_customer.id, 'recall_id', v_recall_id));

    INSERT INTO event_logs (type, payload)
    VALUES ('EMAIL_SENT', jsonb_build_object('customer_id', v_customer.id, 'recall_id', v_recall_id));
  END LOOP;

  -- Log rappel créé
  INSERT INTO event_logs (type, payload)
  VALUES ('RECALL_TRIGGERED', jsonb_build_object(
    'product_id', p_product_id,
    'dlc_ref', p_dlc_ref,
    'dlc_window', jsonb_build_object('start', v_dlc_start, 'end', v_dlc_end),
    'severity', p_severity,
    'lots_affected', v_lots_count,
    'customers_notified', v_customers_count
  ));

  RETURN QUERY SELECT v_recall_id, v_lots_count, v_customers_count, 'Rappel créé et notifications envoyées', TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 4. acknowledge_recall_notification - Confirmer notification (ACK)
-- ============================================================================

CREATE OR REPLACE FUNCTION acknowledge_recall_notification(p_notification_id UUID)
RETURNS TABLE(
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  v_notification RECORD;
BEGIN
  -- Récupérer notification
  SELECT * INTO v_notification FROM recall_notifications WHERE id = p_notification_id;
  IF v_notification IS NULL THEN
    RETURN QUERY SELECT FALSE, 'Notification introuvable';
    RETURN;
  END IF;

  -- Mettre à jour ACK
  UPDATE recall_notifications
  SET ack_status = 'ACKNOWLEDGED', acked_at = NOW(), escalation_status = 'NONE'
  WHERE id = p_notification_id;

  -- Log événement
  INSERT INTO event_logs (type, payload)
  VALUES ('ESCALATION_RESOLVED', jsonb_build_object(
    'notification_id', p_notification_id,
    'customer_id', v_notification.customer_id,
    'recall_id', v_notification.recall_id
  ));

  RETURN QUERY SELECT TRUE, 'Notification confirmée, escalade annulée';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 5. trigger_escalation_if_timeout - Escalade auto après timeout
-- ============================================================================

CREATE OR REPLACE FUNCTION trigger_escalation_if_timeout()
RETURNS TABLE(
  escalations_triggered INTEGER,
  message TEXT
) AS $$
DECLARE
  v_escalation_count INTEGER := 0;
  v_timeout_seconds INTEGER;
  v_notification RECORD;
BEGIN
  -- Récupérer timeout depuis config (env var ou valeur par défaut 10)
  v_timeout_seconds := COALESCE(
    (SELECT setting FROM pg_settings WHERE name = 'app.escalation_timeout_seconds'),
    '10'
  )::INTEGER;

  -- Trouver notifications non-ACK depuis plus que timeout
  FOR v_notification IN
    SELECT id, recall_id, customer_id
    FROM recall_notifications
    WHERE ack_status = 'PENDING'
      AND escalation_status = 'NONE'
      AND sent_at IS NOT NULL
      AND (NOW() - sent_at) > (v_timeout_seconds || ' seconds')::INTERVAL
  LOOP
    -- Déclencher escalade
    UPDATE recall_notifications
    SET escalation_status = 'ONCALL_NOTIFIED'
    WHERE id = v_notification.id;

    v_escalation_count := v_escalation_count + 1;

    -- Simuler appel
    INSERT INTO event_logs (type, payload)
    VALUES ('CALL_TRIGGERED', jsonb_build_object(
      'notification_id', v_notification.id,
      'customer_id', v_notification.customer_id,
      'recall_id', v_notification.recall_id
    ));

    -- Notifier on-call
    INSERT INTO event_logs (type, payload)
    VALUES ('ONCALL_ALERT', jsonb_build_object(
      'notification_id', v_notification.id,
      'customer_id', v_notification.customer_id,
      'recall_id', v_notification.recall_id,
      'escalation_time', v_timeout_seconds
    ));
  END LOOP;

  RETURN QUERY SELECT v_escalation_count, 'Escalades déclenchées pour non-confirmation';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- INDICES POUR PERFORMANCES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_lots_product_dlc ON lots(product_id, dlc);
CREATE INDEX IF NOT EXISTS idx_lots_status ON lots(status);
CREATE INDEX IF NOT EXISTS idx_allocations_order ON allocations(order_item_id);
CREATE INDEX IF NOT EXISTS idx_allocations_lot ON allocations(lot_id);
CREATE INDEX IF NOT EXISTS idx_recall_notifications_status ON recall_notifications(ack_status, escalation_status);
CREATE INDEX IF NOT EXISTS idx_recall_notifications_customer ON recall_notifications(customer_id);
CREATE INDEX IF NOT EXISTS idx_event_logs_type_date ON event_logs(type, created_at DESC);

-- ============================================================================
-- SÉCURITÉ - ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- REMARQUE: RLS détaillée en fonction des rôles à implémenter selon le contexte métier.
-- Exemples:
--   - Clients voient seulement leurs commandes et rappels
--   - Production voit stock + réception
--   - On-call voit escalades non-résolues

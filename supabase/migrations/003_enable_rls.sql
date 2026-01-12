-- ============================================================================
-- MIGRATION 003 - ROW LEVEL SECURITY (RLS) ACTIVATION
-- ============================================================================
-- Activation RLS sur tables sensibles
-- À exécuter APRÈS 001 et 002
-- 
-- Sécurité:
-- - Activation RLS sur toutes les tables données
-- - Policies par rôle (admin, production, fournisseur, client, oncall)
-- - Service role bypass RLS (pour RPC et serveur)
-- 
-- Rôles:
-- - admin: Accès complet (bypass RLS)
-- - production: Accès stock/lots/mouvements
-- - client: Accès commandes + rappels concernant + ack
-- - fournisseur: Accès produits/rappels de leurs produits
-- - oncall: Accès rappels escaladés
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. ACTIVATION RLS
-- ============================================================================

ALTER TABLE lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_ranges ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE recalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE recall_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE recall_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sim_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sim_events ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. POLICIES PAR TABLE
-- ============================================================================

-- ============================================================================
-- PRODUCTS & PRODUCT_RANGES (public read, admin write)
-- ============================================================================

CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (active = TRUE);

CREATE POLICY "Admin can insert products"
  ON products FOR INSERT
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin can update products"
  ON products FOR UPDATE
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin can delete products"
  ON products FOR DELETE
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Anyone can view product ranges"
  ON product_ranges FOR SELECT
  USING (TRUE);

CREATE POLICY "Admin can insert product ranges"
  ON product_ranges FOR INSERT
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin can update product ranges"
  ON product_ranges FOR UPDATE
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin can delete product ranges"
  ON product_ranges FOR DELETE
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ============================================================================
-- LOTS (stock control - production/admin read, admin write)
-- ============================================================================

CREATE POLICY "Production can view all lots"
  ON lots FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('production', 'admin'));

CREATE POLICY "Production can create lots"
  ON lots FOR INSERT
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('production', 'admin'));

CREATE POLICY "Production can update lot status"
  ON lots FOR UPDATE
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('production', 'admin'))
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('production', 'admin'));

CREATE POLICY "Production can delete lots"
  ON lots FOR DELETE
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('production', 'admin'));

CREATE POLICY "Clients can see only their allocated lots (via orders)"
  ON lots FOR SELECT
  USING (
    id IN (
      SELECT DISTINCT a.lot_id
      FROM allocations a
      INNER JOIN order_items oi ON oi.id = a.order_item_id
      INNER JOIN orders o ON o.id = oi.order_id
      INNER JOIN customers c ON c.id = o.customer_id
      WHERE c.id = (SELECT id FROM customers WHERE email = auth.jwt() ->> 'email' LIMIT 1)
    )
  );

-- ============================================================================
-- CUSTOMERS (PII - own profile + admin)
-- ============================================================================

CREATE POLICY "Customers see only their own profile"
  ON customers FOR SELECT
  USING (
    email = auth.jwt() ->> 'email'
    OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'production')
  );

CREATE POLICY "Admin can insert customers"
  ON customers FOR INSERT
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin can update customers"
  ON customers FOR UPDATE
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin can delete customers"
  ON customers FOR DELETE
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ============================================================================
-- ORDERS & ORDER_ITEMS (customer-specific + admin/production)
-- ============================================================================

CREATE POLICY "Customers see their own orders"
  ON orders FOR SELECT
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE email = auth.jwt() ->> 'email'
    )
    OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'production')
  );

CREATE POLICY "Admin and production can view all orders"
  ON orders FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'production'));

CREATE POLICY "Admin can insert orders"
  ON orders FOR INSERT
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin can update orders"
  ON orders FOR UPDATE
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin can delete orders"
  ON orders FOR DELETE
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Customers see items in their orders"
  ON order_items FOR SELECT
  USING (
    order_id IN (
      SELECT o.id FROM orders o
      INNER JOIN customers c ON c.id = o.customer_id
      WHERE c.email = auth.jwt() ->> 'email'
    )
    OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'production')
  );

-- ============================================================================
-- ALLOCATIONS (internal - production/admin only)
-- ============================================================================

CREATE POLICY "Production and admin view allocations"
  ON allocations FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'production'));

CREATE POLICY "Admin can insert allocations"
  ON allocations FOR INSERT
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin can update allocations"
  ON allocations FOR UPDATE
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin can delete allocations"
  ON allocations FOR DELETE
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ============================================================================
-- RECALLS (shared: admin/production manage, fournisseur/client/oncall view own)
-- ============================================================================

CREATE POLICY "Admin and production view all recalls"
  ON recalls FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'production'));

CREATE POLICY "Admin can insert recalls"
  ON recalls FOR INSERT
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin can update recalls"
  ON recalls FOR UPDATE
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin can delete recalls"
  ON recalls FOR DELETE
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Fournisseur views recalls"
  ON recalls FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'fournisseur');

-- ============================================================================
-- RECALL_LOTS (internal - admin/production)
-- ============================================================================

CREATE POLICY "Admin and production view recall lots"
  ON recall_lots FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'production'));

CREATE POLICY "Admin can insert recall lots"
  ON recall_lots FOR INSERT
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin can update recall lots"
  ON recall_lots FOR UPDATE
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin can delete recall lots"
  ON recall_lots FOR DELETE
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ============================================================================
-- RECALL_NOTIFICATIONS (customer-specific + admin/oncall)
-- ============================================================================

CREATE POLICY "Customers see their own recall notifications"
  ON recall_notifications FOR SELECT
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE email = auth.jwt() ->> 'email'
    )
    OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'production', 'oncall')
  );

CREATE POLICY "Customers can acknowledge their notifications"
  ON recall_notifications FOR UPDATE
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE email = auth.jwt() ->> 'email'
    )
  )
  WITH CHECK (
    customer_id IN (
      SELECT id FROM customers WHERE email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Admin and oncall manage escalations"
  ON recall_notifications FOR UPDATE
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'oncall'))
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'oncall'));

-- ============================================================================
-- INVENTORY_MOVEMENTS & INVENTORY_BALANCES (production/admin)
-- ============================================================================

CREATE POLICY "Production and admin view inventory movements"
  ON inventory_movements FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'production'));

CREATE POLICY "Production and admin manage inventory movements"
  ON inventory_movements FOR INSERT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'production'));

CREATE POLICY "Production and admin view inventory balances"
  ON inventory_balances FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'production'));

CREATE POLICY "Production and admin insert inventory balances"
  ON inventory_balances FOR INSERT
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'production'));

CREATE POLICY "Production and admin update inventory balances"
  ON inventory_balances FOR UPDATE
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'production'))
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'production'));

CREATE POLICY "Production and admin delete inventory balances"
  ON inventory_balances FOR DELETE
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'production'));

-- ============================================================================
-- EVENT_LOGS (admin/production read, RPC write)
-- ============================================================================

CREATE POLICY "Production and admin view event logs"
  ON event_logs FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'production'));

CREATE POLICY "Anyone can insert events (via RPC)"
  ON event_logs FOR INSERT
  WITH CHECK (TRUE);

-- ============================================================================
-- SIM_RUNS & SIM_EVENTS (admin/production)
-- ============================================================================

CREATE POLICY "Admin and production view simulations"
  ON sim_runs FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'production'));

CREATE POLICY "Admin and production create simulations"
  ON sim_runs FOR INSERT
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'production'));

CREATE POLICY "Admin and production update simulations"
  ON sim_runs FOR UPDATE
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'production'))
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'production'));

CREATE POLICY "Admin and production delete simulations"
  ON sim_runs FOR DELETE
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'production'));

CREATE POLICY "Admin and production view simulation events"
  ON sim_events FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'production'));

CREATE POLICY "Admin and production create simulation events"
  ON sim_events FOR INSERT
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'production'));

-- ============================================================================
-- NOTES
-- ============================================================================
-- 
-- RLS ne s'applique PAS à:
-- - Service role (SUPABASE_SERVICE_ROLE_KEY) - utilisé pour RPC et serveur
-- - Authenticated avec rôle 'admin' - bypass RLS dans les policies
-- 
-- Pour tester RLS:
-- 1. Connectez-vous avec user (anon key)
-- 2. Vérifiez que auth.uid() et auth.jwt() retournent les bonnes valeurs
-- 3. Vérifiez que les policies s'appliquent (SELECT retourne moins de data)
-- 
-- Rollback:
-- Si RLS cause des problèmes:
--   ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
--   ... (toutes les tables)
-- 
-- ============================================================================

COMMIT;

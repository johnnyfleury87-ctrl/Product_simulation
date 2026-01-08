-- ============================================================================
-- SCHEMA INITIAL - SIMULATION TRAÇABILITÉ PRODUITS & DLC
-- ============================================================================
-- Étape 1 : RÔLES & VUES (fondation)
-- Étape 2 : GAMME DE PRODUITS
-- Étape 3 : RÉCEPTION & STOCK
-- Étape 4 : COMMANDES CLIENTS
-- Étape 5 : SIMULATION ENGINE
-- Étape 6 : RAPPEL PRODUIT
-- Étape 7 : NOTIFICATIONS & ESCALADE
-- ============================================================================

-- ============================================================================
-- ÉTAPE 2 : GAMME DE PRODUITS
-- ============================================================================

CREATE TABLE product_ranges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('FRAIS', 'FRUITS_LEGUMES', 'CONGELES', 'SECS', 'VOLUMINEUX')),
  dlc_min_days INTEGER NOT NULL,
  dlc_max_days INTEGER NOT NULL,
  daily_demand_weight INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  range_id UUID NOT NULL REFERENCES product_ranges(id),
  unit TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- ÉTAPE 3 : RÉCEPTION & STOCK (DLC protégée)
-- ============================================================================

CREATE TABLE lots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  lot_code TEXT NOT NULL,
  dlc DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'ARRIVAGE' CHECK (status IN ('ARRIVAGE', 'STOCK', 'RAYON', 'BLOQUE', 'RAPPEL')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lots_product_id ON lots(product_id);
CREATE INDEX IF NOT EXISTS idx_lots_dlc ON lots(dlc);
CREATE INDEX IF NOT EXISTS idx_lots_status ON lots(status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_lots_unique ON lots(product_id, lot_code, dlc);

CREATE TABLE inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id UUID NOT NULL REFERENCES lots(id),
  type TEXT NOT NULL CHECK (type IN ('INBOUND', 'MOVE', 'PICK', 'SHIP', 'DELIVER', 'BLOCK')),
  from_zone TEXT,
  to_zone TEXT,
  qty INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_lot_id ON inventory_movements(lot_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_type ON inventory_movements(type);

CREATE TABLE inventory_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id UUID NOT NULL REFERENCES lots(id),
  zone TEXT NOT NULL,
  qty INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_balances_lot_id ON inventory_balances(lot_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_inventory_balances_unique ON inventory_balances(lot_id, zone);

-- ============================================================================
-- ÉTAPE 4 : COMMANDES CLIENTS (simulation massive)
-- ============================================================================

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  adresse TEXT NOT NULL,
  telephone TEXT,
  email TEXT NOT NULL,
  demo_imei TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  status TEXT NOT NULL DEFAULT 'CREATED' CHECK (status IN ('CREATED', 'PICKING', 'SHIPPED', 'DELIVERED')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  product_id UUID NOT NULL REFERENCES products(id),
  qty INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Allocation FEFO (First Expiry First Out)
CREATE TABLE allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID NOT NULL REFERENCES order_items(id),
  lot_id UUID NOT NULL REFERENCES lots(id),
  qty INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'RESERVED' CHECK (status IN ('RESERVED', 'PICKED', 'SHIPPED', 'DELIVERED')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_allocations_order_item_id ON allocations(order_item_id);
CREATE INDEX IF NOT EXISTS idx_allocations_lot_id ON allocations(lot_id);
CREATE INDEX IF NOT EXISTS idx_allocations_status ON allocations(status);

-- ============================================================================
-- ÉTAPE 5 : SIMULATION ENGINE (400 commandes/jour)
-- ============================================================================

CREATE TABLE sim_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'READY' CHECK (status IN ('READY', 'RUNNING', 'PAUSED', 'DONE')),
  orders_per_day INTEGER NOT NULL DEFAULT 400,
  days INTEGER NOT NULL DEFAULT 7,
  tick_seconds INTEGER NOT NULL DEFAULT 10,
  current_day INTEGER DEFAULT 0,
  current_tick INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sim_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sim_run_id UUID NOT NULL REFERENCES sim_runs(id),
  type TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sim_events_sim_run_id ON sim_events(sim_run_id);
CREATE INDEX IF NOT EXISTS idx_sim_events_type ON sim_events(type);

-- ============================================================================
-- ÉTAPE 6 : RAPPEL PRODUIT (DLC ± 3 jours)
-- ============================================================================

CREATE TABLE recalls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  dlc_ref DATE NOT NULL,
  dlc_start DATE NOT NULL,
  dlc_end DATE NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'RESOLVED', 'CANCELLED')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recalls_product_id ON recalls(product_id);
CREATE INDEX IF NOT EXISTS idx_recalls_dlc_ref ON recalls(dlc_ref);
CREATE INDEX IF NOT EXISTS idx_recalls_status ON recalls(status);

CREATE TABLE recall_lots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recall_id UUID NOT NULL REFERENCES recalls(id),
  lot_id UUID NOT NULL REFERENCES lots(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recall_lots_recall_id ON recall_lots(recall_id);
CREATE INDEX IF NOT EXISTS idx_recall_lots_lot_id ON recall_lots(lot_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_recall_lots_unique ON recall_lots(recall_id, lot_id);

-- ============================================================================
-- ÉTAPE 7 : NOTIFICATIONS & ESCALADE
-- ============================================================================

CREATE TABLE recall_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recall_id UUID NOT NULL REFERENCES recalls(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  sms_status TEXT DEFAULT 'PENDING' CHECK (sms_status IN ('PENDING', 'SENT', 'FAILED')),
  email_status TEXT DEFAULT 'PENDING' CHECK (email_status IN ('PENDING', 'SENT', 'FAILED')),
  ack_status TEXT DEFAULT 'PENDING' CHECK (ack_status IN ('PENDING', 'ACKNOWLEDGED')),
  escalation_status TEXT DEFAULT 'NONE' CHECK (escalation_status IN ('NONE', 'TRIGGERED', 'ONCALL_NOTIFIED', 'RESOLVED')),
  sent_at TIMESTAMP,
  acked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recall_notifications_recall_id ON recall_notifications(recall_id);
CREATE INDEX IF NOT EXISTS idx_recall_notifications_customer_id ON recall_notifications(customer_id);
CREATE INDEX IF NOT EXISTS idx_recall_notifications_ack_status ON recall_notifications(ack_status);
CREATE INDEX IF NOT EXISTS idx_recall_notifications_escalation_status ON recall_notifications(escalation_status);

CREATE TABLE event_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('SMS_SENT', 'EMAIL_SENT', 'CALL_TRIGGERED', 'ONCALL_ALERT', 'RECEPTION', 'ALLOCATION', 'DELIVERY', 'RECALL_TRIGGERED')),
  payload JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_logs_type ON event_logs(type);
CREATE INDEX IF NOT EXISTS idx_event_logs_created_at ON event_logs(created_at);

-- ============================================================================
-- ÉTAPE 1 AMÉLIORÉE: AUTHENTIFICATION & PROFILS
-- ============================================================================

-- Table profiles (lien vers auth.users de Supabase)
CREATE TABLE profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'production', 'client', 'fournisseur', 'oncall')),
  nom TEXT,
  prenom TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Activation RLS sur profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Chacun voit son profil
CREATE POLICY "Users see own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Admin voit tous les profils
CREATE POLICY "Admin sees all profiles"
  ON profiles FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ============================================================================
-- FIN DU SCHÉMA INITIAL
-- ============================================================================

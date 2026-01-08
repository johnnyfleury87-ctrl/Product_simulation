-- ============================================================================
-- SEED INITIAL - DONNÉES DE SIMULATION
-- ============================================================================
-- Gammes de produits (Étape 2)
-- Produits exemples (Étape 2)
-- Clients fictifs (Étape 4)
-- Stock initial (Étape 3)
-- ============================================================================

-- ============================================================================
-- GAMMES DE PRODUITS (réalistes)
-- ============================================================================

INSERT INTO product_ranges (name, category, dlc_min_days, dlc_max_days, daily_demand_weight)
VALUES
  ('Ultra-frais', 'FRAIS', 2, 5, 100),
  ('Fruits & légumes', 'FRUITS_LEGUMES', 3, 10, 95),
  ('Surgelés', 'CONGELES', 120, 365, 60),
  ('Secs', 'SECS', 180, 720, 50),
  ('Volumineux', 'VOLUMINEUX', 30, 180, 40)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- PRODUITS (exemples réalistes)
-- ============================================================================

-- Ultra-frais
INSERT INTO products (product_code, name, range_id, unit, active)
SELECT 'PROD-001-LAIT', 'Lait demi-écrémé 1L', id, 'L', TRUE FROM product_ranges WHERE category = 'FRAIS'
UNION ALL
SELECT 'PROD-002-YAOURT', 'Yaourt nature 500g', id, 'g', TRUE FROM product_ranges WHERE category = 'FRAIS'
UNION ALL
SELECT 'PROD-003-FROMAGE', 'Fromage blanc 200g', id, 'g', TRUE FROM product_ranges WHERE category = 'FRAIS'
UNION ALL
-- Fruits & légumes
SELECT 'PROD-004-POMME', 'Pommes Gala (1kg)', id, 'kg', TRUE FROM product_ranges WHERE category = 'FRUITS_LEGUMES'
UNION ALL
SELECT 'PROD-005-TOMATE', 'Tomates cerises (250g)', id, 'g', TRUE FROM product_ranges WHERE category = 'FRUITS_LEGUMES'
UNION ALL
SELECT 'PROD-006-CAROTTE', 'Carottes (500g)', id, 'g', TRUE FROM product_ranges WHERE category = 'FRUITS_LEGUMES'
UNION ALL
-- Surgelés
SELECT 'PROD-007-PIZZA', 'Pizza surgelée 400g', id, 'g', TRUE FROM product_ranges WHERE category = 'CONGELES'
UNION ALL
SELECT 'PROD-008-FRITES', 'Frites surgelées 1kg', id, 'kg', TRUE FROM product_ranges WHERE category = 'CONGELES'
UNION ALL
SELECT 'PROD-009-EPINARDS', 'Épinards surgelés 500g', id, 'g', TRUE FROM product_ranges WHERE category = 'CONGELES'
UNION ALL
-- Secs
SELECT 'PROD-010-PATES', 'Pâtes sèches 500g', id, 'g', TRUE FROM product_ranges WHERE category = 'SECS'
UNION ALL
SELECT 'PROD-011-RIZ', 'Riz blanc 1kg', id, 'kg', TRUE FROM product_ranges WHERE category = 'SECS'
UNION ALL
SELECT 'PROD-012-SUCRE', 'Sucre blanc 1kg', id, 'kg', TRUE FROM product_ranges WHERE category = 'SECS'
UNION ALL
-- Volumineux
SELECT 'PROD-013-PAPIER', 'Papier toilette 12 rouleaux', id, 'rouleaux', TRUE FROM product_ranges WHERE category = 'VOLUMINEUX'
UNION ALL
SELECT 'PROD-014-EAU', 'Eau minérale 6L', id, 'L', TRUE FROM product_ranges WHERE category = 'VOLUMINEUX'
ON CONFLICT (product_code) DO NOTHING;

-- ============================================================================
-- CLIENTS FICTIFS (50 clients pour simulation)
-- ============================================================================

INSERT INTO customers (nom, prenom, adresse, telephone, email, demo_imei)
VALUES
  ('Dupont', 'Jean', '123 rue de Paris, 75001 Paris', '06 11 22 33 44', 'jean.dupont@email.com', 'IMEI001'),
  ('Martin', 'Marie', '456 avenue des Champs, 75008 Paris', '06 22 33 44 55', 'marie.martin@email.com', 'IMEI002'),
  ('Bernard', 'Paul', '789 boulevard Saint-Germain, 75005 Paris', '06 33 44 55 66', 'paul.bernard@email.com', 'IMEI003'),
  ('Durand', 'Anne', '321 rue de Lyon, 75012 Paris', '06 44 55 66 77', 'anne.durand@email.com', 'IMEI004'),
  ('Lefevre', 'Pierre', '654 avenue Montaigne, 75008 Paris', '06 55 66 77 88', 'pierre.lefevre@email.com', 'IMEI005'),
  ('Moreau', 'Claire', '987 rue de la Paix, 75002 Paris', '06 66 77 88 99', 'claire.moreau@email.com', 'IMEI006'),
  ('Laurent', 'Michel', '147 boulevard Haussmann, 75009 Paris', '06 77 88 99 00', 'michel.laurent@email.com', 'IMEI007'),
  ('Simon', 'Françoise', '258 rue Rivoli, 75004 Paris', '06 88 99 00 11', 'francoise.simon@email.com', 'IMEI008'),
  ('Michel', 'Jacques', '369 avenue de l''Opéra, 75002 Paris', '06 99 00 11 22', 'jacques.michel@email.com', 'IMEI009'),
  ('David', 'Christiane', '741 boulevard Poissonnière, 75002 Paris', '07 00 11 22 33', 'christiane.david@email.com', 'IMEI010'),
  ('Bertrand', 'Gérard', '852 rue Saint-Honoré, 75001 Paris', '07 11 22 33 44', 'gerard.bertrand@email.com', 'IMEI011'),
  ('Roux', 'Monique', '963 avenue des Invalides, 75007 Paris', '07 22 33 44 55', 'monique.roux@email.com', 'IMEI012'),
  ('Vincent', 'Alain', '159 boulevard Saint-Michel, 75005 Paris', '07 33 44 55 66', 'alain.vincent@email.com', 'IMEI013'),
  ('Fournier', 'Bernadette', '267 rue de Strasbourg, 75010 Paris', '07 44 55 66 77', 'bernadette.fournier@email.com', 'IMEI014'),
  ('Morel', 'Arlette', '375 avenue Foch, 75016 Paris', '07 55 66 77 88', 'arlette.morel@email.com', 'IMEI015'),
  ('Girard', 'Marcel', '483 boulevard Exelmans, 75016 Paris', '07 66 77 88 99', 'marcel.girard@email.com', 'IMEI016'),
  ('André', 'Henriette', '591 rue Molière, 75002 Paris', '07 77 88 99 00', 'henriette.andre@email.com', 'IMEI017'),
  ('Lebreton', 'Guy', '609 avenue Kléber, 75016 Paris', '07 88 99 00 11', 'guy.lebreton@email.com', 'IMEI018'),
  ('Noel', 'Marguerite', '717 rue Ampère, 75017 Paris', '07 99 00 11 22', 'marguerite.noel@email.com', 'IMEI019'),
  ('Gauthier', 'Denis', '825 boulevard Voltaire, 75011 Paris', '08 00 11 22 33', 'denis.gauthier@email.com', 'IMEI020'),
  ('Perrin', 'Irène', '933 rue de Belleville, 75020 Paris', '08 11 22 33 44', 'irene.perrin@email.com', 'IMEI021'),
  ('Blanc', 'Lucien', '41 place de la Concorde, 75008 Paris', '08 22 33 44 55', 'lucien.blanc@email.com', 'IMEI022'),
  ('Blanchard', 'Colette', '52 rue de Turbigo, 75002 Paris', '08 33 44 55 66', 'colette.blanchard@email.com', 'IMEI023'),
  ('Arnould', 'Luc', '63 avenue du Maine, 75014 Paris', '08 44 55 66 77', 'luc.arnould@email.com', 'IMEI024'),
  ('Aubry', 'Viviane', '74 rue Caumartin, 75009 Paris', '08 55 66 77 88', 'viviane.aubry@email.com', 'IMEI025'),
  ('Aubert', 'Robert', '85 boulevard des Invalides, 75007 Paris', '08 66 77 88 99', 'robert.aubert@email.com', 'IMEI026'),
  ('Aubin', 'Sylvain', '96 rue de Longchamp, 75016 Paris', '08 77 88 99 00', 'sylvain.aubin@email.com', 'IMEI027'),
  ('Aubé', 'Thérèse', '107 avenue Victor-Hugo, 75016 Paris', '08 88 99 00 11', 'therese.aube@email.com', 'IMEI028'),
  ('Aubeau', 'Yves', '118 rue du Bac, 75007 Paris', '08 99 00 11 22', 'yves.aubeau@email.com', 'IMEI029'),
  ('Aubel', 'Zoé', '129 boulevard Raspail, 75006 Paris', '09 00 11 22 33', 'zoe.aubel@email.com', 'IMEI030'),
  ('Aubelin', 'Albert', '130 rue Caulaincourt, 75018 Paris', '09 11 22 33 44', 'albert.aubelin@email.com', 'IMEI031'),
  ('Aubert', 'Amélie', '131 rue Campagne-Première, 75014 Paris', '09 22 33 44 55', 'amelie.aubert@email.com', 'IMEI032'),
  ('Aubeuf', 'Bernard', '132 rue Cavé, 75018 Paris', '09 33 44 55 66', 'bernard.aubeuf@email.com', 'IMEI033'),
  ('Aubier', 'Catherine', '133 rue Chanaleilles, 75014 Paris', '09 44 55 66 77', 'catherine.aubier@email.com', 'IMEI034'),
  ('Aubié', 'Danielle', '134 rue Chaptal, 75009 Paris', '09 55 66 77 88', 'danielle.aubie@email.com', 'IMEI035'),
  ('Aubier', 'Éric', '135 rue Chenavaz, 75009 Paris', '09 66 77 88 99', 'eric.aubier@email.com', 'IMEI036'),
  ('Aubry', 'Fabienne', '136 rue Chevreul, 75011 Paris', '09 77 88 99 00', 'fabienne.aubry@email.com', 'IMEI037'),
  ('Aubusson', 'Grégoire', '137 rue Chifaudel, 75011 Paris', '09 88 99 00 11', 'gregoire.aubusson@email.com', 'IMEI038'),
  ('Aucamus', 'Hélène', '138 rue Chinois, 75020 Paris', '09 99 00 11 22', 'helene.aucamus@email.com', 'IMEI039'),
  ('Aucamus', 'Isabelle', '139 rue Chlotilde, 75014 Paris', '10 00 11 22 33', 'isabelle.aucamus@email.com', 'IMEI040'),
  ('Aucamus', 'Joël', '140 rue Choisy, 75013 Paris', '10 11 22 33 44', 'joel.aucamus@email.com', 'IMEI041'),
  ('Aucamus', 'Karine', '141 rue Chouanard, 75012 Paris', '10 22 33 44 55', 'karine.aucamus@email.com', 'IMEI042'),
  ('Aucamus', 'Laure', '142 rue Christiani, 75004 Paris', '10 33 44 55 66', 'laure.aucamus@email.com', 'IMEI043'),
  ('Aucamus', 'Marc', '143 rue Chuchus, 75017 Paris', '10 44 55 66 77', 'marc.aucamus@email.com', 'IMEI044'),
  ('Aucamus', 'Nathalie', '144 rue Cino-del-Duca, 75016 Paris', '10 55 66 77 88', 'nathalie.aucamus@email.com', 'IMEI045'),
  ('Aucamus', 'Olivier', '145 rue Claude-Bernard, 75005 Paris', '10 66 77 88 99', 'olivier.aucamus@email.com', 'IMEI046'),
  ('Aucamus', 'Patricia', '146 rue Claude-Vellefaux, 75010 Paris', '10 77 88 99 00', 'patricia.aucamus@email.com', 'IMEI047'),
  ('Aucamus', 'Quentin', '147 rue Clémentis, 75012 Paris', '10 88 99 00 11', 'quentin.aucamus@email.com', 'IMEI048'),
  ('Aucamus', 'Reine', '148 rue Clément, 75006 Paris', '10 99 00 11 22', 'reine.aucamus@email.com', 'IMEI049'),
  ('Aucamus', 'Stéphane', '149 rue Clément-Marot, 75008 Paris', '11 00 11 22 33', 'stephane.aucamus@email.com', 'IMEI050')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- STOCK INITIAL (5 lots par produit avec DLC variées)
-- ============================================================================

-- Générer stock initial pour chaque produit
WITH product_stock AS (
  SELECT p.id, p.product_code, pr.dlc_min_days, pr.dlc_max_days
  FROM products p
  JOIN product_ranges pr ON p.range_id = pr.id
)
INSERT INTO lots (product_id, lot_code, dlc, status)
SELECT 
  ps.id,
  'LOT-' || ps.product_code || '-' || TO_CHAR(NOW() + (i || ' days')::interval, 'YYYYMMDD') || '-' || LPAD(j::TEXT, 2, '0'),
  CURRENT_DATE + (ps.dlc_min_days + (j - 1) * (ps.dlc_max_days - ps.dlc_min_days) / 5)::INTEGER,
  'STOCK'
FROM product_stock ps
CROSS JOIN GENERATE_SERIES(0, 4) AS i
CROSS JOIN GENERATE_SERIES(1, 5) AS j
ON CONFLICT DO NOTHING;

-- Créer mouvements d'arrivage pour chaque lot
INSERT INTO inventory_movements (lot_id, type, from_zone, to_zone, qty)
SELECT l.id, 'INBOUND', NULL, 'ARRIVAGE', 100
FROM lots l
ON CONFLICT DO NOTHING;

-- Créer balances initiales en zone ARRIVAGE
INSERT INTO inventory_balances (lot_id, zone, qty)
SELECT l.id, 'ARRIVAGE', 100
FROM lots l
LEFT JOIN inventory_balances ib ON l.id = ib.lot_id
WHERE ib.id IS NULL
ON CONFLICT (lot_id, zone) DO NOTHING;

-- ============================================================================
-- FIN DES DONNÉES INITIALES
-- ============================================================================

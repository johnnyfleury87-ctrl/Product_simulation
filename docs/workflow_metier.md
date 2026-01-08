# Workflow Métier - Simulation Traçabilité Produits & DLC

## Table des matières

1. [Flux Réception & Stock](#flux-réception--stock)
2. [Flux Commandes Clients](#flux-commandes-clients)
3. [Flux Allocation FEFO](#flux-allocation-fefo)
4. [Flux Rappel Produit](#flux-rappel-produit)
5. [Flux Notifications & Escalade](#flux-notifications--escalade)
6. [Simulation Engine](#simulation-engine)
7. [Rôles & Permissions](#rôles--permissions)

---

## Flux Réception & Stock

### Acteur: Production

**Démarrage:** Production scanne produit à la réception

### Étapes

#### 1️⃣ Scan Réception
```
Production entre:
  - product_code    (ex: "PROD-001-LAIT")
  - lot_code        (ex: "LOT-2026010801")
  - dlc             (ex: "2026-01-15")
  - quantité        (ex: 100)
```

#### 2️⃣ Validation
```
Système vérifie:
  ✓ product_code existe et actif
  ✓ lot_code unique pour (product_id, dlc)
  ✓ dlc cohérente avec gamme (min_days .. max_days)
  ✓ quantité > 0
```

#### 3️⃣ Création lot
```
INSERT INTO lots (product_id, lot_code, dlc, status)
  status = 'ARRIVAGE'  (zone temporaire réception)
```

#### 4️⃣ Mouvement INBOUND
```
INSERT INTO inventory_movements (lot_id, type, qty)
  type = 'INBOUND'
  from_zone = NULL
  to_zone = 'ARRIVAGE'
  qty = quantité scanée
```

#### 5️⃣ Balance initiale
```
INSERT INTO inventory_balances (lot_id, zone, qty)
  zone = 'ARRIVAGE'
  qty = quantité scanée
```

#### 6️⃣ Event log
```
INSERT INTO event_logs (type, payload)
  type = 'RECEPTION'
  payload = {
    "product_code": "PROD-001-LAIT",
    "lot_code": "LOT-2026010801",
    "dlc": "2026-01-15",
    "qty": 100,
    "zone": "ARRIVAGE"
  }
```

### État final
```
Lot: ARRIVAGE → en attente de moving vers STOCK
```

---

## Flux Commandes Clients

### Acteurs: Client (création) + Système (allocation)

### Étapes

#### 1️⃣ Client crée commande
```
Client entre:
  - produits + quantités (ex: PROD-001-LAIT × 5, PROD-004-POMME × 10)
```

#### 2️⃣ Création Order & OrderItems
```
INSERT INTO orders (customer_id, status)
  status = 'CREATED'

INSERT INTO order_items (order_id, product_id, qty)
  (1 ligne par produit de la commande)
```

#### 3️⃣ Allocation FEFO automatique
```
Pour chaque order_item:
  1. Récupérer tous les lots du produit avec status ≠ BLOQUE/RAPPEL
  2. Trier par DLC ASC (plus proche expiration en premier)
  3. Allouer lots jusqu'à qty complètement satisfaite:
     - Lot 1 (dlc-1): 50 unités → alloc 50
     - Lot 2 (dlc-2): 100 unités → alloc 50
     ✓ Allocation complète
```

#### 4️⃣ Allocation FEFO (détail)
```
INSERT INTO allocations (order_item_id, lot_id, qty, status)
  status = 'RESERVED'

Chaque ligne = un lot alloué pour un item

Exemple:
  order_item_id="oi-123" (PROD-001-LAIT × 100)
  → lot-1 × 50 (dlc 2026-01-10)
  → lot-2 × 50 (dlc 2026-01-12)
```

#### 5️⃣ Picking
```
Production prépare la commande:
  - Cherche allocations.status = RESERVED
  - Effectue picking pour chaque allocation
  - Mouvement PICK: lot zone de stock → PICKING

INSERT INTO inventory_movements (lot_id, type, qty)
  type = 'PICK'
  from_zone = 'STOCK'
  to_zone = 'PICKING'
  qty = allocation.qty

UPDATE allocations.status = 'PICKED'
UPDATE orders.status = 'PICKING'
```

#### 6️⃣ Expédition
```
Logistique expédie:
  - Mouvement SHIP: PICKING → EXPEDITION

INSERT INTO inventory_movements (lot_id, type, qty)
  type = 'SHIP'
  from_zone = 'PICKING'
  to_zone = 'EXPEDITION'

UPDATE allocations.status = 'SHIPPED'
UPDATE orders.status = 'SHIPPED'
```

#### 7️⃣ Livraison client
```
Client reçoit:
  - Mouvement DELIVER: EXPEDITION → CHEZ_CLIENT

INSERT INTO inventory_movements (lot_id, type, qty)
  type = 'DELIVER'
  to_zone = 'CHEZ_CLIENT'

UPDATE allocations.status = 'DELIVERED'
UPDATE orders.status = 'DELIVERED'

INSERT INTO event_logs (type, payload)
  type = 'DELIVERY'
  payload = { order_id, customer_id, items_count, lots_used }
```

### État final
```
Order: DELIVERED
Allocations: DELIVERED
Lot: un peu moins de stock dans CHEZ_CLIENT
```

---

## Flux Allocation FEFO

### Principe
**FEFO = First Expiry First Out**

Client ne choisit jamais la DLC. Système alloue automatiquement les lots les plus proches de l'expiration.

### Exemple concret

**Situation stock:**
```
PROD-001-LAIT:
  - Lot-A: DLC 2026-01-10, Qty 100 ✓ (proche expiration)
  - Lot-B: DLC 2026-01-20, Qty 50
  - Lot-C: DLC 2026-02-10, Qty 200
```

**Client commande:** PROD-001-LAIT × 120

**Allocation automatique:**
```
1. Lot-A (dlc 2026-01-10): 100 unités
2. Lot-B (dlc 2026-01-20): 20 unités
─────────────────────────
Total: 120 unités ✓

Lot-C non utilisé (DLC trop lointaine)
```

### Règles immuables

1. ✅ **Tri par DLC ASC (ascending)**
2. ✅ **Tous les lots disponibles du produit candidats**
3. ✅ **Exclure lots: BLOQUE, RAPPEL**
4. ✅ **Allouer jusqu'à qty satisfaction**
5. ✅ **1 allocation = 1 lot**
6. ❌ **Pas de choix manuel**
7. ❌ **Pas de mélange avec autre produit**

---

## Flux Rappel Produit

### Acteur: Fournisseur

### Démarrage
Fournisseur déclare un problème avec un produit pour une DLC donnée.

### Étapes

#### 1️⃣ Déclaration rappel
```
Fournisseur entre:
  - product_code  (ex: "PROD-001-LAIT")
  - dlc_ref       (ex: "2026-01-15")
  - severity      (LOW | MEDIUM | HIGH | CRITICAL)
```

#### 2️⃣ Calcul fenêtre DLC
```
dlc_start = dlc_ref - 3 jours = 2026-01-12
dlc_end   = dlc_ref + 3 jours = 2026-01-18

Fenêtre de rappel: [2026-01-12 .. 2026-01-18]
```

#### 3️⃣ Création recall
```
INSERT INTO recalls (product_id, dlc_ref, dlc_start, dlc_end, severity, status)
  status = 'ACTIVE'
```

#### 4️⃣ Trouver lots impactés
```
SELECT l.id FROM lots l
WHERE l.product_id = <product_id>
  AND l.dlc BETWEEN dlc_start AND dlc_end
  AND l.status NOT IN ('RAPPEL', 'BLOQUE')

Exemple: Lot-A (dlc 2026-01-14), Lot-B (dlc 2026-01-16)
```

#### 5️⃣ Marquer lots en RAPPEL
```
UPDATE lots SET status = 'RAPPEL'
  WHERE id IN (lot-ids calculés)

INSERT INTO recall_lots (recall_id, lot_id)
  (1 ligne par lot rappelé)
```

#### 6️⃣ Trouver clients impactés
```
SELECT DISTINCT c.id, c.email, c.telephone
FROM customers c
WHERE c.id IN (
  SELECT a.customer_id FROM allocations a
  WHERE a.lot_id IN (<lots rappelés>)
    AND a.status IN ('PICKED', 'SHIPPED', 'DELIVERED')
)

Logique:
  - Lot rappelé
  - Alloué à une commande
  - Statut ≥ PICKED (en route ou livré)
  → Client impacté
```

#### 7️⃣ Créer notifications
```
INSERT INTO recall_notifications (recall_id, customer_id)
  sms_status = 'PENDING'
  email_status = 'PENDING'
  ack_status = 'PENDING'
  escalation_status = 'NONE'
```

#### 8️⃣ Event log
```
INSERT INTO event_logs (type, payload)
  type = 'RECALL_TRIGGERED'
  payload = {
    "product_code": "PROD-001-LAIT",
    "dlc_ref": "2026-01-15",
    "dlc_window": ["2026-01-12", "2026-01-18"],
    "severity": "HIGH",
    "lots_count": 5,
    "customers_count": 12
  }
```

### État final
```
Recall: ACTIVE
Lots: status = RAPPEL
Clients impactés: notifiés (SMS + email simulés)
```

---

## Flux Notifications & Escalade

### Acteurs: Système (envoi) + Client (confirmation)

### Étapes

#### 1️⃣ SMS + Email simulés envoyés
```
System trigger (synchrone au rappel):

FOR EACH recall_notification:
  1. Envoyer SMS simulé
     UPDATE sms_status = 'SENT'
     SET sent_at = NOW()
  
  2. Envoyer email simulé
     UPDATE email_status = 'SENT'
     SET sent_at = NOW()

INSERT INTO event_logs (type, payload)
  type = 'SMS_SENT'  / 'EMAIL_SENT'
```

#### 2️⃣ Client confirme (vue client)
```
Client clique "J'ai lu" sur rappel actif

UPDATE recall_notifications
  SET ack_status = 'ACKNOWLEDGED'
      acked_at = NOW()

INSERT INTO event_logs (type, payload)
  type = 'ACK_RECEIVED'
```

#### 3️⃣ Escalade automatique (pas de confirmation après 10 min)
```
Trigger: 10 minutes sans ACK

UPDATE recall_notifications
  SET escalation_status = 'TRIGGERED'

Simuler appel:
INSERT INTO event_logs (type, payload)
  type = 'CALL_TRIGGERED'
  payload = { "customer_id": "...", "reason": "no_ack_after_10min" }

Notifier on-call:
INSERT INTO event_logs (type, payload)
  type = 'ONCALL_ALERT'
  payload = { customer_id, recall_id, customer_phone }

UPDATE escalation_status = 'ONCALL_NOTIFIED'
```

#### 4️⃣ Résolution
```
On-call confirme que client a été contacté:

UPDATE recall_notifications
  SET escalation_status = 'RESOLVED'
      ack_status = 'ACKNOWLEDGED'
      acked_at = NOW()

INSERT INTO event_logs (type, payload)
  type = 'ESCALATION_RESOLVED'
```

### Flux temporel

```
Temps réel → Temps simulé (10 min = 10 sec)

T=0:
  Recall déclaré
  SMS/email envoyés
  ack_status = PENDING

T=10s (10 min simulées):
  Si toujours PENDING:
    escalation_status = TRIGGERED
    Appel simulé
    ONCALL_ALERT
  Sinon:
    ack_status = ACKNOWLEDGED
    escalation_status = NONE (ou RESOLVED)
```

---

## Simulation Engine

### Acteur: Système (automatisé)

### Paramètres
```
orders_per_day:  400 (défaut)
days:            7   (défaut)
tick_seconds:    10  (10 min = 10 sec réels)

Soit: 400 × 7 = 2800 commandes sur 7 jours
```

### Logique

#### Phase 1: Initialisation
```
1. Vérifier stock initial
   (Si absent, générer 5 lots par produit)
   
2. Vérifier 50 clients existe
   (Si absent, générer 50 clients fictifs)
   
3. Créer sim_run avec status = READY
```

#### Phase 2: Simulation jour par jour
```
FOR day = 1 TO days:
  1. Générer 400 commandes pour ce jour
     
     FOR each product:
       - Probabilité = daily_demand_weight / somme_poids
       - Nombre commandes = floor(400 × probabilité)
       - Quantité = aléatoire (1 à 10 unités)
       - Customer = aléatoire parmi 50
       
  2. Allouer FEFO automatique
  
  3. Avancer statuts:
     - CREATED → PICKING   (après quelques ticks)
     - PICKING → SHIPPED   (après quelques ticks)
     - SHIPPED → DELIVERED (après quelques ticks)
     
  4. Log chaque transition
```

#### Phase 3: Fin simulation
```
Status sim_run = DONE

Statistiques finales:
  - Total commandes créées
  - Total articles livrés
  - % utilisation stock
  - % allocation perfect match
```

### Timeline exemple

```
Jour 1:
  T=0s:  Générer 400 commandes jour 1
  T=1s:  Allocations FEFO
  T=2s:  Picking automatique 1ère batch
  T=3s:  Shipping 1ère batch
  T=5s:  Delivery 1ère batch
  T=6s:  Générer batch jour 2
  ...
  
Jour 7:
  T=60s: Générer dernières commandes
  T=65s: Dernières livraisons
  T=70s: sim_run.status = DONE
```

---

## Rôles & Permissions

### 1. Admin
```
Droits:
  ✓ Voir tous les données
  ✓ Reset démo complet
  ✓ Lancer simulations
  ✓ Créer/modifier rôles

Vues:
  - Control Tower (dashboard complet)
  - Logs d'événements
  - Gestion simulations
```

### 2. Production
```
Droits:
  ✓ Scan réception (créer lots)
  ✓ Voir stock
  ✓ Picking commandes
  ✓ Bloquer lot défectueux
  ✗ Modifier DLC
  ✗ Créer rappels

Vues:
  - Vue Production
    - Saisie réception
    - Recherche produit + DLC
    - Liste de picking
    - Actions blocage
```

### 3. Client
```
Droits:
  ✓ Créer commandes
  ✓ Suivi commande
  ✓ Confirmation rappel ("J'ai lu")
  ✗ Changer DLC allocée
  ✗ Voir données autres clients

Vues:
  - Vue Client
    - Historique commandes
    - Rappels actifs
    - Bouton "J'ai lu"
    - Détail livraisons
```

### 4. Fournisseur
```
Droits:
  ✓ Déclarer rappel
  ✓ Voir impact clients
  ✓ Voir statut escalade
  ✗ Annuler rappel seul
  ✗ Bloquer lot

Vues:
  - Vue Fournisseur
    - Formulaire rappel (product_code + dlc_ref)
    - Tableau impact clients
    - Statuts notifications
```

### 5. On-call
```
Droits:
  ✓ Voir non-confirmés
  ✓ Escalades actives
  ✓ Confirmer contact client
  ✓ Résoudre escalade
  ✗ Modifier rappel
  ✗ Créer commandes

Vues:
  - Vue On-call
    - Queue non-confirmés
    - Escalades actives
    - Contacts client
    - Actions résolution
```

---

## Cohérence & Immuabilité

### Règles système (non négociables)

| Règle | Raison |
|-------|--------|
| DLC créée seul au scan, jamais modifiée | Garantit traçabilité |
| Allocations FEFO automatiques | Évite gaspillage |
| Statuts progressent linéairement | Traçabilité simple |
| Movements immutables | Audit complet |
| Lots rappelés conservés | Trace d'événement |
| SMS/email = notifications simulées | Démo sans vraies données |

---

**Date:** 2026-01-08
**Version:** 1.0 (Simulation)
**Conformité:** PDF "PROJET SIMULATION traca.pdf"

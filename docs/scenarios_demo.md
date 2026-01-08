# Scénarios Démo - Simulation Traçabilité Produits & DLC

## Introduction

Cette section décrit des scénarios concrets testant chaque fonction du système.
Tous les scénarios sont **100% fictifs** (données, clients, produits).

---

## Scénario 1: Réception Simple

### Objectif
Tester le flux de réception produit (scan → création lot → stock).

### Acteur
Production

### Étapes

1. **Production scanne produit à la réception**
   ```
   Product Code:  PROD-001-LAIT
   Lot Code:      LOT-2026010801
   DLC:           2026-01-15
   Quantité:      100
   ```

2. **Système valide**
   ```
   ✓ PROD-001-LAIT existe et est actif
   ✓ LOT-2026010801 unique pour ce produit
   ✓ DLC 2026-01-15 cohérente avec gamme FRAIS (2-5 jours)
   ✓ Quantité = 100 > 0
   ```

3. **Résultats attendus**
   ```
   Lots table:
     - id: uuid-123
     - product_id: <PROD-001-LAIT>
     - lot_code: LOT-2026010801
     - dlc: 2026-01-15
     - status: ARRIVAGE
   
   Inventory_movements:
     - type: INBOUND
     - lot_id: uuid-123
     - qty: 100
     - to_zone: ARRIVAGE
   
   Inventory_balances:
     - lot_id: uuid-123
     - zone: ARRIVAGE
     - qty: 100
   
   Event_logs:
     - type: RECEPTION
     - payload: {"product_code": "PROD-001-LAIT", ...}
   ```

4. **Validation**
   - Lot créé en ARRIVAGE ✓
   - Stock initial 100 unités ✓
   - Mouvement loggé ✓

---

## Scénario 2: Commande Simple + Allocation FEFO

### Objectif
Tester l'allocation automatique FEFO (premier lot = DLC plus proche).

### Stock pré-existant
```
PROD-001-LAIT:
  LOT-A: dlc 2026-01-10, qty 100 (le plus proche)
  LOT-B: dlc 2026-01-15, qty 100
  LOT-C: dlc 2026-01-20, qty 100
```

### Acteur
Client

### Étapes

1. **Client crée commande**
   ```
   Customer: Jean Dupont
   Items:
     - PROD-001-LAIT × 120
   ```

2. **Système crée order**
   ```
   Orders:
     - id: order-456
     - customer_id: <Jean Dupont>
     - status: CREATED
   
   Order_items:
     - order_id: order-456
     - product_id: <PROD-001-LAIT>
     - qty: 120
   ```

3. **Allocation FEFO automatique (CLEF)**
   ```
   Système cherche lots du produit, tri par DLC ASC:
   
   1. LOT-A (dlc 2026-01-10): disponible 100
      Allouer 100 → allocation-001
   
   2. LOT-B (dlc 2026-01-15): disponible 100
      Besoin restant: 120 - 100 = 20
      Allouer 20 → allocation-002
   
   LOT-C non utilisé (20 unités suffisent)
   ```

4. **Résultats attendus**
   ```
   Allocations:
     1. order_item_id: <PROD-001-LAIT × 120>
        lot_id: <LOT-A>
        qty: 100
        status: RESERVED
   
     2. order_item_id: <PROD-001-LAIT × 120>
        lot_id: <LOT-B>
        qty: 20
        status: RESERVED
   ```

5. **Validation**
   - Allocation totale = 100 + 20 = 120 ✓
   - LOT-A (plus proche) alloué en premier ✓
   - LOT-C non alloué ✓
   - FEFO correct ✓

---

## Scénario 3: Rappel Simple

### Objectif
Tester la déclaration rappel et l'identification des clients impactés.

### Stock pré-existant
```
PROD-001-LAIT:
  LOT-X: dlc 2026-01-12, qty 100, statut: DELIVERED (à client A)
  LOT-Y: dlc 2026-01-14, qty 100, statut: SHIPPED (à client B)
  LOT-Z: dlc 2026-01-18, qty 100, statut: STOCK (pas livré)
```

### Commandes existantes
```
Client A: LOT-X × 50 (DELIVERED)
Client B: LOT-Y × 75 (SHIPPED)
Client C: LOT-Z × 100 (CREATED, jamais picking)
```

### Acteur
Fournisseur

### Étapes

1. **Fournisseur déclare rappel**
   ```
   Product Code:  PROD-001-LAIT
   DLC Référence: 2026-01-14 (problème détecté)
   Severity:      HIGH
   ```

2. **Système calcule fenêtre**
   ```
   dlc_start = 2026-01-14 - 3 = 2026-01-11
   dlc_end   = 2026-01-14 + 3 = 2026-01-17
   
   Fenêtre: [2026-01-11 .. 2026-01-17]
   ```

3. **Système trouve lots impactés**
   ```
   Lots dans fenêtre (dlc BETWEEN 2026-01-11 AND 2026-01-17):
     ✓ LOT-X (dlc 2026-01-12) → RAPPELABLE
     ✓ LOT-Y (dlc 2026-01-14) → RAPPELABLE
     ✗ LOT-Z (dlc 2026-01-18) → HORS FENÊTRE
   ```

4. **Marquer lots en RAPPEL**
   ```
   Lots:
     LOT-X: status = RAPPEL
     LOT-Y: status = RAPPEL
     LOT-Z: status = STOCK (inchangé)
   
   Recall_lots:
     - recall_id: recall-789
     - lot_id: <LOT-X>
     - lot_id: <LOT-Y>
   ```

5. **Identifier clients impactés**
   ```
   Allocations avec lots rappelés ET statut ≥ PICKED:
   
   ✓ Client A:
     - alloc_id: alloc-001
     - lot_id: LOT-X
     - status: DELIVERED (≥ PICKED)
     → IMPACTÉ
   
   ✓ Client B:
     - alloc_id: alloc-002
     - lot_id: LOT-Y
     - status: SHIPPED (≥ PICKED)
     → IMPACTÉ
   
   ✗ Client C:
     - alloc_id: alloc-003
     - lot_id: LOT-Z
     - status: CREATED (< PICKED)
     → NON IMPACTÉ (jamais picking)
   ```

6. **Créer notifications**
   ```
   Recall_notifications:
     1. recall_id: recall-789
        customer_id: <Client A>
        sms_status: PENDING
        email_status: PENDING
        ack_status: PENDING
        escalation_status: NONE
   
     2. recall_id: recall-789
        customer_id: <Client B>
        sms_status: PENDING
        email_status: PENDING
        ack_status: PENDING
        escalation_status: NONE
   ```

7. **Résultats attendus**
   ```
   Recall créé avec:
     - product_id: <PROD-001-LAIT>
     - dlc_ref: 2026-01-14
     - dlc_start: 2026-01-11
     - dlc_end: 2026-01-17
     - lots_rappelés: 2 (LOT-X, LOT-Y)
     - clients_notifiés: 2 (Client A, Client B)
   
   Event_logs:
     - type: RECALL_TRIGGERED
     - payload: {lots: 2, customers: 2, severity: HIGH}
   ```

8. **Validation**
   - Fenêtre DLC correcte ✓
   - Lots hors fenêtre ignorés ✓
   - Client C non impacté ✓
   - 2 notifications créées ✓

---

## Scénario 4: Escalade Non-Confirmation

### Objectif
Tester l'escalade automatique après 10 minutes sans confirmation.

### Contexte
Rappel actif depuis le Scénario 3 pour Client A.

### Timeline

**T = 0s** (14:00:00)
```
Rappel déclaré
SMS + email simulés envoyés

Recall_notifications (Client A):
  sms_status: SENT
  email_status: SENT
  ack_status: PENDING
  escalation_status: NONE
  sent_at: 2026-01-08 14:00:00

Event_logs:
  - SMS_SENT
  - EMAIL_SENT
```

**T = 5s** (14:05:00) - Pas d'action client

```
Rappel_notifications toujours:
  ack_status: PENDING
  escalation_status: NONE
```

**T = 10s** (14:10:00) - Dépassement 10 min (délai escalade)

```
Trigger: pas de confirmation après 10 min

UPDATE recall_notifications
  SET escalation_status = 'TRIGGERED'

Simuler appel:
Event_logs:
  - type: CALL_TRIGGERED
  - payload: {customer_id: Client A, phone: "06 11 22 33 44"}

Notifier on-call:
Event_logs:
  - type: ONCALL_ALERT
  - payload: {customer_id: Client A, recall_id: recall-789}

UPDATE escalation_status = 'ONCALL_NOTIFIED'
```

**T = 15s** (14:15:00) - On-call contacte client manuellement

```
Client A confirme via appel (pas via interface)

On-call met à jour:
UPDATE recall_notifications
  SET escalation_status = 'RESOLVED'
      ack_status = 'ACKNOWLEDGED'
      acked_at: 2026-01-08 14:15:00

Event_logs:
  - type: ESCALATION_RESOLVED
```

### Résultats attendus

```
Séquence d'événements:
  1. SMS_SENT (T=0s)
  2. EMAIL_SENT (T=0s)
  3. CALL_TRIGGERED (T=10s)
  4. ONCALL_ALERT (T=10s)
  5. ESCALATION_RESOLVED (T=15s)

Statut final recall_notification:
  - sms_status: SENT ✓
  - email_status: SENT ✓
  - ack_status: ACKNOWLEDGED ✓
  - escalation_status: RESOLVED ✓
```

---

## Scénario 5: Simulation Complète (7 jours)

### Objectif
Tester la simulation moteur de 400 commandes/jour sur 7 jours.

### Paramètres
```
orders_per_day: 400
days: 7
tick_seconds: 10
Total: 2800 commandes
```

### Déroulement

**Phase 1: Setup (T=0s)**
```
✓ Vérifier stock initial (5 lots × 15 produits)
✓ Vérifier 50 clients existent
✓ Créer sim_run avec status = RUNNING
```

**Jour 1 (T=0s to T=10s, simulé 24h)**
```
T=0s:
  - Générer 400 commandes jour 1
  - Allocation FEFO pour chaque commande
  - Event log: 400 × ORDER_CREATED

T=1s:
  - Picking 1ère batch (100 commandes)
  - Event log: 100 × PICKING_STARTED

T=3s:
  - Shipping 1ère batch (100 commandes)
  - Event log: 100 × SHIPPED

T=5s:
  - Delivery 1ère batch (100 commandes)
  - Event log: 100 × DELIVERED

... (cycles continus)

T=9s:
  - Dernières livraisons jour 1
  - Préparation jour 2
```

**Jour 2-6: Même schéma**

**Jour 7 (T=60s to T=70s, dernier jour)**
```
T=60s:
  - Générer 400 commandes jour 7
  - Allocations FEFO
  
T=65s:
  - Picking final

T=70s:
  - Dernières livraisons
  - sim_run.status = DONE
```

### Statistiques finale

```
sim_run final status = DONE

Statistiques calculées:
  - Total commandes: 2800
  - Commandes livrées: ~2700 (96%)
  - Articles totaux alloués: ~15000
  - Utilisation stock: 82%
  - Lots expirés: 15
  
Event_logs entries: ~15000
  - ORDER_CREATED: 2800
  - ALLOCATION_MADE: 2800
  - PICKING: 2800
  - SHIPPED: 2800
  - DELIVERED: 2700
```

### Validation

```
✓ 2800 commandes générées
✓ Allocation FEFO appliquée
✓ Statuts progressent linéairement
✓ Stock se réduit progressivement
✓ Événements loggés complètement
✓ Simulation finit en 70s (= 7 jours réels)
```

---

## Scénario 6: Cas d'erreur - DLC Invalide

### Objectif
Tester le rejet d'une DLC incohérente avec la gamme.

### Acteur
Production

### Tentative
```
Product Code:  PROD-001-LAIT (gamme: FRAIS, dlc 2-5 jours)
Lot Code:      LOT-INVALID-001
DLC:           2026-02-15 (33 jours ❌ > max 5)
Quantité:      100
```

### Résultat attendu
```
Validation ÉCHOUE ❌

Message d'erreur:
  "DLC incohérente avec gamme FRAIS.
   Max: 5 jours, fourni: 33 jours"

Aucune création:
  ✗ Lot NOT créé
  ✗ Mouvement NOT créé
  ✗ Event log NOT créé
```

---

## Scénario 7: Cas d'erreur - Allocation Impossible

### Objectif
Tester le cas où la quantité demandée > stock disponible.

### Stock disponible
```
PROD-004-POMME: 50 unités (1 lot uniquement)
```

### Acteur
Client

### Tentative
```
Customer: Marie Martin
Items:
  - PROD-004-POMME × 100
```

### Résultat attendu
```
Option 1 (recommandée):
  Allocation partielle:
    - Allouer 50 (tout ce qui existe)
    - Status order: PARTIALLY_ALLOCATED
    - Notification client: "Seules 50 unités disponibles"

Option 2 (si backorder):
  Créer queue:
    - Status: BACKORDER
    - Attendre réapprovisionnement
    - Notification quand disponible
```

Note: Le PDF ne spécifie pas ce cas. À clarifier avec métier.

---

## Scénario 8: Reset Démo

### Objectif
Tester la capacité à réinitialiser pour nouvelle démo.

### Acteur
Admin

### Action
```
Admin clique "Reset Démo"
```

### Résultats attendus
```
Tables conservées:
  ✓ product_ranges (gammes)
  ✓ products (articles)
  ✓ customers (clients)

Tables réinitialisées:
  ✓ lots (stock initial recréé)
  ✓ inventory_movements (vidée)
  ✓ inventory_balances (recalculée)
  ✓ orders (vidée)
  ✓ order_items (vidée)
  ✓ allocations (vidée)
  ✓ recalls (vidée)
  ✓ recall_notifications (vidée)
  ✓ event_logs (vidée)
  ✓ sim_runs (vidée)

Stock initial:
  ✓ 5 lots par produit régénérés
  ✓ DLC cohérentes avec gammes
  ✓ Balances recalculées correctement
  
Vérification:
  ✓ Aucune DLC incohérente
  ✓ Balances = somme mouvements
```

---

## Checklist de Test

### Test Unitaire
- [ ] Création lot + validation DLC
- [ ] Allocation FEFO (tri correct)
- [ ] Mouvement mouvement + balance
- [ ] Rappel + fenêtre DLC
- [ ] Notification + escalade

### Test Intégration
- [ ] Commande E2E (création → livraison)
- [ ] Rappel E2E (déclaration → escalade)
- [ ] Simulation 7 jours complète
- [ ] Reset démo

### Test Non-Régression
- [ ] DLC jamais modifiée
- [ ] Balances = mouvements
- [ ] FEFO toujours appliquée
- [ ] Événements toujours loggés
- [ ] Statuts ne régressent pas

---

**Date:** 2026-01-08
**Version:** 1.0 (Simulation)
**Conformité:** PDF "PROJET SIMULATION traca.pdf"

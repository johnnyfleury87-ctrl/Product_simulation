# Architecture Complète - Simulation Traçabilité Produits & DLC

## Vue d'ensemble

Système complet de simulation de traçabilité produits basé sur Supabase et Vercel. Ce système simule:
- Réception de produits avec scan (ProduitID + lot + DLC)
- Gestion de stock multi-zones
- Commandes clients massives (400/jour)
- Traçabilité fine lot/DLC → client
- Rappels produit par DLC ± 3 jours
- Notifications clients (SMS + email simulés)
- Escalade automatique en cas de non-confirmation
- Dashboard central temps réel

## Principes fondamentaux

### 1. DLC protégée (non négociable)
- **Interdiction totale** de créer/modifier une DLC manuellement
- Seul le **scan réception** crée un lot + DLC
- Les DLC sont toujours dérivées des gammes de produits
- Garantit l'intégrité métier de la simulation

### 2. Allocation FEFO (First Expiry First Out)
- Automatique, jamais manuelle
- Le client ne choisit jamais la DLC
- Système alloue le lot le plus proche de l'expiration

### 3. Traçabilité immuable
- Tout mouvement est loggé dans `inventory_movements`
- Les balances dérivent toujours des mouvements
- Permet de rejouer/auditer toute l'histoire

## Schéma de base de données

### Couche 1: Gammes & Produits

#### `product_ranges` (catégories de produits)
```
- id (UUID)
- name (TEXT): ex. "Ultra-frais"
- category (ENUM): FRAIS | FRUITS_LEGUMES | CONGELES | SECS | VOLUMINEUX
- dlc_min_days (INTEGER): durée minimale avant expiration
- dlc_max_days (INTEGER): durée maximale avant expiration
- daily_demand_weight (INTEGER): poids pour simulation (plus élevé = plus commandé)
- created_at, updated_at
```

#### `products` (articles individuels)
```
- id (UUID)
- product_code (TEXT, UNIQUE): ProduitID scanné (ex. "PROD-001-LAIT")
- name (TEXT): description
- range_id (FK → product_ranges)
- unit (TEXT): L, kg, g, etc.
- active (BOOLEAN)
- created_at, updated_at
```

### Couche 2: Stock & Réception

#### `lots` (unités de stock avec DLC)
```
- id (UUID)
- product_id (FK → products)
- lot_code (TEXT): identifiant du lot (ex. "LOT-PROD-001-20260108-01")
- dlc (DATE): date limite de consommation [PROTÉGÉE]
- status (ENUM): ARRIVAGE | STOCK | RAYON | BLOQUE | RAPPEL
- created_at, updated_at

Indices:
- product_id, dlc, status (requêtes fréquentes)
- (product_id, lot_code, dlc) UNIQUE
```

#### `inventory_movements` (historique de tous les mouvements)
```
- id (UUID)
- lot_id (FK → lots)
- type (ENUM): INBOUND | MOVE | PICK | SHIP | DELIVER | BLOCK
- from_zone (TEXT): zone d'origine
- to_zone (TEXT): zone de destination
- qty (INTEGER): quantité déplacée
- created_at

Types de mouvements:
- INBOUND: arrivée en ARRIVAGE
- MOVE: déplacement entre zones
- PICK: picking pour commande
- SHIP: expédition
- DELIVER: livraison client
- BLOCK: blocage (rappel, défaut)
```

#### `inventory_balances` (soldes par lot/zone)
```
- id (UUID)
- lot_id (FK → lots)
- zone (TEXT): zone de stockage
- qty (INTEGER): quantité en zone
- created_at, updated_at

Indices:
- (lot_id, zone) UNIQUE
```

**Cohérence clé:** `balances` se recalculent TOUJOURS à partir de `movements`.

### Couche 3: Commandes clients

#### `customers` (clients fictifs)
```
- id (UUID)
- nom, prenom (TEXT)
- adresse (TEXT)
- telephone, email (TEXT)
- demo_imei (TEXT): identifiant demo pour notifications
- created_at, updated_at

Données: 50 clients fictifs générés au seed
```

#### `orders` (commandes clients)
```
- id (UUID)
- customer_id (FK → customers)
- status (ENUM): CREATED | PICKING | SHIPPED | DELIVERED
- created_at, updated_at

Flux:
1. CREATED: commande créée
2. PICKING: sélection de stock
3. SHIPPED: expédition
4. DELIVERED: livraison client

Indices: customer_id, status
```

#### `order_items` (lignes de commande)
```
- id (UUID)
- order_id (FK → orders)
- product_id (FK → products)
- qty (INTEGER): quantité commandée
- created_at

Indices: order_id, product_id
```

#### `allocations` (allocation FEFO)
```
- id (UUID)
- order_item_id (FK → order_items)
- lot_id (FK → lots)
- qty (INTEGER): quantité allouée de ce lot
- status (ENUM): RESERVED | PICKED | SHIPPED | DELIVERED
- created_at, updated_at

Logique FEFO:
- Sélectionne les lots du produit par DLC (plus proche expiration en premier)
- Respecte la quantité demandée
- Se met à jour avec l'avancement du statut

Indices: order_item_id, lot_id, status
```

### Couche 4: Simulation Engine

#### `sim_runs` (exécutions de simulation)
```
- id (UUID)
- status (ENUM): READY | RUNNING | PAUSED | DONE
- orders_per_day (INTEGER): 400 par défaut
- days (INTEGER): 7 par défaut
- tick_seconds (INTEGER): 10 par défaut (10 min = 10 sec)
- current_day (INTEGER): jour actuel
- current_tick (INTEGER): tick actuel
- created_at, updated_at

Données: Une seule sim_run active à la fois
```

#### `sim_events` (événements simulés)
```
- id (UUID)
- sim_run_id (FK → sim_runs)
- type (TEXT): type d'événement
- payload (JSONB): données événement
- created_at

Types d'événements:
- ORDER_CREATED
- ALLOCATION_MADE
- STATUS_UPDATED
- etc.
```

**Logique simulation:**
1. Générer stock initial (5 lots par produit)
2. Générer clients si absents (50 clients)
3. Pour chaque jour simulé:
   - Créer 400 commandes
   - Produits choisis selon `daily_demand_weight`
   - Allocations FEFO automatiques
   - Avancer les statuts (10 min = 10 secondes réelles)

### Couche 5: Rappels produit

#### `recalls` (rappels produits)
```
- id (UUID)
- product_id (FK → products)
- dlc_ref (DATE): DLC de référence déclarée par fournisseur
- dlc_start (DATE): dlc_ref - 3 jours
- dlc_end (DATE): dlc_ref + 3 jours
- severity (ENUM): LOW | MEDIUM | HIGH | CRITICAL
- status (ENUM): ACTIVE | RESOLVED | CANCELLED
- created_at, updated_at

Calcul automatique:
- Tous les lots avec dlc ENTRE dlc_start ET dlc_end sont rappelés
- Ne supprime pas les lots, change juste le statut

Indices: product_id, dlc_ref, status
```

#### `recall_lots` (lots impactés)
```
- id (UUID)
- recall_id (FK → recalls)
- lot_id (FK → lots)
- created_at

Relations (recall_id, lot_id) UNIQUE
```

**Clients impactés:** Identifiés via allocations ayant un lot rappelé.

### Couche 6: Notifications & Escalade

#### `recall_notifications` (notifications aux clients)
```
- id (UUID)
- recall_id (FK → recalls)
- customer_id (FK → customers)
- sms_status (ENUM): PENDING | SENT | FAILED
- email_status (ENUM): PENDING | SENT | FAILED
- ack_status (ENUM): PENDING | ACKNOWLEDGED
- escalation_status (ENUM): NONE | TRIGGERED | ONCALL_NOTIFIED | RESOLVED
- sent_at (TIMESTAMP): quand SMS/email envoyés
- acked_at (TIMESTAMP): quand client a confirmé
- created_at, updated_at

Logique:
1. SMS + email envoyés simultanément
2. Client confirme via vue client
3. Si pas confirmé après 10 min → appel simulé + oncall alert
4. Event log de chaque transition

Indices: recall_id, customer_id, ack_status, escalation_status
```

#### `event_logs` (journal d'événements)
```
- id (UUID)
- type (ENUM): SMS_SENT | EMAIL_SENT | CALL_TRIGGERED | ONCALL_ALERT | RECEPTION | ALLOCATION | DELIVERY | RECALL_TRIGGERED
- payload (JSONB): détails l'événement
- created_at

Trace complète de tous les événements système
Indices: type, created_at
```

## Rôles système

| Rôle | Droits | Vues |
|------|--------|------|
| **admin** | Tout voir, reset démo | Contrôle total |
| **production** | Réception, stock, picking, blocage | Vue Production |
| **client** | Commande, suivi, confirmation rappel | Vue Client |
| **fournisseur** | Déclaration rappels | Vue Fournisseur |
| **oncall** | Gestion urgences escaladées | Vue On-call |

## Flux métier clés

### Flux Réception
```
1. Production scanne : product_code + lot_code + DLC + qty
2. Système crée:
   - lot (avec DLC protégée)
   - mouvement INBOUND
   - balance ARRIVAGE
3. Lot en attente de moving vers STOCK
```

### Flux Commande
```
1. Client crée commande (product_id + qty)
2. Système crée order_items
3. Allocation FEFO automatique:
   - Sélectionne lots du produit par DLC (ascending)
   - Crée allocations jusqu'à qty satisfaite
4. Statuts progressent: CREATED → PICKING → SHIPPED → DELIVERED
   (À chaque transition: mouvement + event_log)
```

### Flux Rappel
```
1. Fournisseur déclare: product_code + dlc_ref
2. Système calcule: dlc_start = dlc_ref - 3j, dlc_end = dlc_ref + 3j
3. Trouve tous les lots dans fenêtre
4. Identifie clients impactés via allocations (PICKING, SHIPPED, DELIVERED)
5. Crée recall_notifications
6. SMS + email simulés envoyés
7. Client confirme → ack_status = ACKNOWLEDGED
8. Si no ack après 10 min → escalation
```

## Règles de cohérence

1. **DLC immuable après création du lot** → garantit traçabilité
2. **Allocations FEFO automatiques** → pas de choix manuel
3. **Balances = somme des mouvements** → permet recalcul/audit
4. **Statuts progressent linéairement** → pas de régression
5. **Rappels ne suppriment pas les lots** → conserve trace
6. **Événements immutables** → journal d'audit complet

## Variables d'environnement attendues

```bash
# .env.local (local)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx (serveur uniquement)

# Vercel (production)
Mêmes variables via secrets Vercel
SERVICE_ROLE_KEY JAMAIS côté client
```

## Sécurité

- ❌ **Aucune clé Supabase en dur dans le code**
- ❌ **SERVICE_ROLE_KEY jamais côté client**
- ✅ **Tout accès via .env**
- ✅ **RLS (Row Level Security) par rôle** (à implémenter dans l'app)

## Fichiers obligatoires

```
/supabase/migrations/001_init_schema.sql  → Schéma complet
/supabase/seed/seed.sql                   → Données initiales
/docs/architecture_complete.md            → Ce document
/docs/workflow_metier.md                  → Flux métier détaillés
/docs/scenarios_demo.md                   → Scénarios de test
/docs/CHANGELOG_SIMULATION.md             → Historique implémentation
```

---

**Date de création:** 2026-01-08
**Version:** 1.0 (Simulation)
**Statut:** Conforme au PDF "PROJET SIMULATION traca.pdf"

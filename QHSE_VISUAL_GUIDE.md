# 🎨 QHSE Recall Simulator - Aperçu visuel

## 📱 Layout principal (Desktop)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 🚨 QHSE Recall Simulator                 Simulation de rappel - Mode DÉMO│
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────────────────────────────┐
│ Lancer un rappel     │  │ KPIs:                                        │
│                      │  │ ┌──────────┐ ┌──────────┐ ┌──┐ ┌──┐         │
│ Produit:             │  │ │12,400    │ │87        │ │✅│ │✅│         │
│ ▼ Yaourt Nature XXX  │  │ │Unités    │ │Clients   │ │ C│ │ T│         │
│                      │  │ │          │ │          │ │ent│ │ran│      │
│ DLC Date:            │  │ └──────────┘ └──────────┘ └──┘ └──┘         │
│ [2026-01-13]         │  │                                              │
│                      │  │ Localisation du stock:                       │
│ Sévérité:            │  │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        │
│ [LOW] [MEDIUM] [HIGH]│  │ │📦    │ │📋    │ │🚚    │ │📨    │        │
│ (HIGH sélectionné)   │  │ │Stock │ │Prep  │ │Trans │ │Livré │        │
│                      │  │ │2,480 │ │2,480 │ │3,100 │ │4,340 │        │
│ ▶ Lancer simulation  │  │ │20%   │ │20%   │ │25%   │ │35%   │        │
│                      │  │ └──────┘ └──────┘ └──────┘ └──────┘        │
│                      │  │                                              │
│                      │  │ Répartition par centre:                      │
│                      │  │ ┌────────────────────┐ ┌────────────────┐  │
│                      │  │ │Centre Île-de-Fr    │ │Centre Rhône-A  │  │
│                      │  │ │4,200 unités        │ │4,000 unités    │  │
│                      │  │ │Paris (IDF)         │ │Lyon (ARA)      │  │
│                      │  │ └────────────────────┘ └────────────────┘  │
│                      │  │                        ┌────────────────┐  │
│                      │  │                        │Centre NAqui.   │  │
│                      │  │                        │4,200 unités    │  │
│                      │  │                        │Bordeaux (NA)   │  │
│                      │  │                        └────────────────┘  │
│                      │  │                                              │
│                      │  │ Actions QHSE:                                │
│                      │  │ [📢 Avertir] [🛑 Stop] [📧 Notifier] [✅ Conf]
│                      │  │                                              │
│                      │  │ État confirmations:                          │
│                      │  │ ✅ Confirmés: 23 clients | ⏳ Attente: 64  │
│                      │  │ 📊 Taux: 26%                                │
└──────────────────────┘  └──────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 👥 Clients impactés (87) [☐ Non-confirmés] [Trier: Centre ▼]           │
├─────────────────────────────────────────────────────────────────────────┤
│ Client    │ Email              │ Tél        │ Centre      │ Localisation │
├───────────┼────────────────────┼────────────┼─────────────┼──────────────┤
│ Jean      │ jean.dupont@...    │ 06 11 22   │ Île-de-Fr   │ 📨 Livré     │
│ Dupont    │                    │            │             │              │
│ Status: ⏳ En attente [Confirmer] ← LIGNE ROUGE CLIGNOTANTE            │
├───────────┴────────────────────┴────────────┴─────────────┴──────────────┤
│ Marie     │ marie.martin@...   │ 06 22 33   │ Île-de-Fr   │ 🚚 Transit   │
│ Martin    │                    │            │             │              │
│ Status: ✅ Confirmé                                                      │
├───────────────────────────────────────────────────────────────────────────┤
│ Paul      │ paul.bernard@...   │ 06 33 44   │ Île-de-Fr   │ 📦 Stock     │
│ Bernard   │                    │            │             │              │
│ Status: ⏳ En attente [Confirmer] ← LIGNE ROUGE CLIGNOTANTE            │
├───────────────────────────────────────────────────────────────────────────┤
│ ... (autres clients)                                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎬 État avant simulation

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 🚨 QHSE Recall Simulator                 Simulation de rappel - Mode DÉMO│
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────────────────────────────┐
│ Lancer un rappel     │  │                                              │
│                      │  │ 👈 Sélectionnez un produit et lancez une     │
│ Produit:             │  │    simulation                                 │
│ ▼ Yaourt Nature XXX  │  │                                              │
│                      │  │                                              │
│ DLC Date:            │  │                                              │
│ [2026-01-13]         │  │                                              │
│                      │  │                                              │
│ Sévérité:            │  │                                              │
│ [LOW] [MEDIUM] [HIGH]│  │                                              │
│                      │  │                                              │
│ ▶ Lancer simulation  │  │                                              │
│                      │  │                                              │
└──────────────────────┘  └──────────────────────────────────────────────┘
```

---

## 🔴 Codage couleur des statuts

### Non-confirmé (Urgent)
```
┌──────────────────────────────────────────────┐
│ ⏳ En attente [Confirmer] [Confirmer] [...]  │  ← LIGNE ROUGE CLIGNOTANTE
│ ✅ SMS | ✅ Email | 🚚 Transit              │
└──────────────────────────────────────────────┘
```

### Confirmé (OK)
```
┌──────────────────────────────────────────────┐
│ ✅ Confirmé                                   │  ← LIGNE VERTE
│ ✅ SMS | ✅ Email | 📨 Livré                 │
└──────────────────────────────────────────────┘
```

### Livré au client (Très urgent)
```
┌──────────────────────────────────────────────┐
│ ⏳ En attente [Confirmer]                     │  ← LIGNE ROUGE + BORDURE ROUGE
│ ✅ SMS | ✅ Email | 📨 LIVRÉ                │
└──────────────────────────────────────────────┘
   ↑ Produit chez le client = plus grave
```

---

## 📊 Badges et icônes

### Localisations
- 📦 **Stock** : Entrepôt (facile à retirer)
- 📋 **Préparation** : Commande en picking
- 🚚 **Transit** : En route
- 📨 **Livré** : Chez le client (grave!)

### Notifications
- ✅ SMS envoyé
- ❌ SMS en attente
- ✅ Email envoyé
- ❌ Email en attente

### Confirmations
- ✅ Confirmé (vert)
- ⏳ En attente (orange clignotant)

### Actions QHSE
- 📢 Avertir les centrales
- 🛑 Stop transport
- 📧 Envoyer SMS + Email
- ✅ Confirmer tous

---

## 🎨 Palette CSS

```css
/* Primaire */
#667eea → Violet (boutons, headers)
#764ba2 → Violet foncé (dégradé)

/* Succès */
#10b981 → Vert (confirmé, ✅)
#059669 → Vert foncé (hover)
#dcfce7 → Vert pâle (badge)

/* Attention */
#f59e0b → Orange (en attente)
#fef3c7 → Orange pâle (badge)
#92400e → Orange foncé (texte)

/* Danger */
#ef4444 → Rouge (non-confirmé, pulse)

/* Neutre */
#f9fafb → Gris très pâle (background)
#e5e7eb → Gris pâle (border)
#9ca3af → Gris moyen (secondary text)
#6b7280 → Gris foncé (secondary text)
```

---

## 🎬 Interactions principales

### 1. Lancer simulation
```
Utilisateur: Choisit produit + DLC + sévérité
             Clique "▶ Lancer simulation"
             ↓
Système:    Génère impacts aléatoires
             Affiche dashboard complet
             Affiche tableau clients
```

### 2. Avertir centrales
```
Utilisateur: Clique [📢 Avertir centrales]
             ↓
Avant:   [📢 Avertir centrales] (bleu)
Après:   [✅ Centrales averties] (gris disabled)
         central_notified = true
         Timestamp enregistré
```

### 3. Envoyer notifications
```
Utilisateur: Clique [📧 Envoyer SMS + Email]
             ↓
Avant:   Tous les clients: ❌ SMS | ❌ Email
Après:   Tous les clients: ✅ SMS | ✅ Email
         sms_sent = true
         email_sent = true
         timestamp_notification = NOW
```

### 4. Confirmer un client
```
Utilisateur: Clique [Confirmer] sur une ligne
             ↓
Avant:   ⏳ En attente (rouge clignotant)
Après:   ✅ Confirmé (vert)
         client_confirmed = true
         timestamp_confirmed = NOW
         Ligne arrête de clignoter
         Taux de confirmation ↑
```

### 5. Confirmer tous
```
Utilisateur: Clique [Confirmer tous]
             ↓
Avant:   23 confirmés / 64 en attente
Après:   87 confirmés / 0 en attente
         Taux: 100%
         Tableau vire au vert
         Tous les clignotements arrêtent
```

---

## 🎯 Points UX clés

✅ **Immédiat** : Pas de loading, tout en mémoire  
✅ **Visuel** : Couleurs sémantiques (rouge=urgent, vert=ok)  
✅ **Intuitif** : Boutons clairs, icônes explicites  
✅ **Interactif** : Chaque action donne feedback visuel  
✅ **Responsive** : Fonctionne sur mobile/tablet/desktop  
✅ **Animé** : Pulse rouge, hover smooth, transitions  
✅ **Tracéable** : Tous les statuts visibles en temps réel  
✅ **Filtrablé** : Voir seulement les urgences si besoin  

---

## 📐 Dimensions (Desktop)

```
Header:               100% × 80px
Main layout:          max-width 1600px
  Left panel:         350px (sticky)
  Right panel:        1fr (flex)
KPIs grid:            4 colonnes (200px min chaque)
Location grid:        4 colonnes (140px min chaque)
Center grid:          3 colonnes (200px min chaque)
Clients table:        100% scrollable H
```

---

## 📱 Dimensions (Mobile)

```
Header:               100% × 60px
Main layout:          1 colonne (100% width)
  Left panel:         100%
  Right panel:        100%
KPIs grid:            2 colonnes
Location grid:        2 colonnes
Center grid:          1 colonne
Clients table:        Scroll horizontal si besoin
Font size:            Réduit de 10%
```

---

**Visual mockup généré:** Janvier 2026 | **Type:** Démo | **Mode:** Fictif

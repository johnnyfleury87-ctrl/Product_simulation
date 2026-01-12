# 🇨🇭 Guide Utilisateur - Dashboard QHSE Suisse (Simulation Temps Réel)

## 🚀 Démarrage Rapide

### 1. Accès à l'application

```
https://[your-vercel-url]/qhse
```

Ou en local:
```bash
npm run dev
# Puis visitez: http://localhost:3000/qhse
```

---

## 📋 Interface - Tour Guidé

### Colonne Gauche: Panneau de Lancement

```
┌─────────────────────────────┐
│  LANCER UN RAPPEL           │
├─────────────────────────────┤
│                             │
│ 🛒 Produit                  │
│  ▼ Yaourt Nature XXX        │
│                             │
│ 📅 DLC Date                 │
│  ▼ 2026-01-15              │
│                             │
│ ⚠️ Sévérité                 │
│  [LOW] [MEDIUM] [HIGH]      │
│                             │
│ ▶ Lancer la simulation      │
│                             │
│ ⏸ Pause (après lancement)  │
│ 🔄 Réinitialiser            │
└─────────────────────────────┘
```

**Étapes:**
1. Sélectionnez un produit dans la liste
2. Choisissez une date DLC (demain par défaut)
3. Sélectionnez le niveau de sévérité:
   - 🟢 **LOW** = 15-35 clients impactés
   - 🟡 **MEDIUM** = 40-100 clients impactés
   - 🔴 **HIGH** = 100-200 clients impactés
4. Cliquez **"▶ Lancer la simulation"**

---

### Colonne Droite: Dashboard (Mise à jour en DIRECT)

#### 📊 KPIs Temps Réel (5 cartes)

```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ 🔹 UNITÉS   │ 🟠 CLIENTS  │ 🟢 CONFIRMÉS│ 🟡 ATTENTE  │ 📈 TAUX     │
│ Concernées  │ Impactés    │             │             │ Confirmation│
│ 8,500       │ 75          │ 45          │ 30          │ 60%         │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
                            ↓
                    MIS À JOUR CHAQUE 2s
```

Ces chiffres **se mettent à jour automatiquement** pendant la simulation.

#### 📦 Localisation du Stock

```
📦 En stock: 3,400 (40%)
📋 En préparation: 2,100 (25%)
🚚 En transit: 1,700 (20%)
📨 Livré au client: 1,300 (15%)
```

#### 🏭 Répartition par Centre Suisse

```
┌───────────────────────────────────────────────────────┐
│ ECU - Ecublens                            [Ecublens]   │
│ Chemin du Croset 9, 1024 Ecublens, Suisse            │
│ 📞 +41 21 555 01 01                                   │
│ 2,800 unités | ✅ 1,500 / ⏳ 1,300                    │
└───────────────────────────────────────────────────────┘
```

Chaque centre affiche:
- 📍 Adresse complète suisse
- 📞 Téléphone CH
- 📦 Nombre d'unités
- ✅/⏳ Confirmations / En attente (LIVE)

#### 🎬 Actions QHSE

```
📢 Avertir les centrales
🛑 Stop transport
📧 Envoyer SMS + Email
Confirmer tous (45/75)
```

Une fois une action complétée, le bouton devient ✅ et se désactive.

#### 🔴 Indicateur Temps Réel

```
🔴 Simulation EN COURS
```

- 🔴 Pulse rouge = simulation active
- ⏸ Si vous cliquez "Pause" → devient "▶ Reprendre"

---

## 📍 Tableau Clients (Bas de page)

### Statuts Visuels

#### 🔴 EN ATTENTE (Pending)

```
┌─────────────────────────────────────────────────────────┐
│ Marie Martin | marie.m@... | +41 21 ... | ECU          │ 🔴
│ 📨 Livré | 125 unités | ❌ SMS ✅ Email | ● EN ATTENTE│
│                                        [Confirmer]      │
└─────────────────────────────────────────────────────────┘
```

**Caractéristiques:**
- Fond **rouge clair**
- Bordure **rouge**
- Badge avec **clignotement** (●●● EN ATTENTE●●●)
- Animation: opacity 1.0 → 0.4 → 1.0 (1.2s loop)
- Bouton "Confirmer" clickable
- **Non-agressif:** adapté pour consulter le tableau pendant 30min

#### 🟢 CONFIRMÉ (Confirmed)

```
┌─────────────────────────────────────────────────────────┐
│ Jean Dupont | jean.d@... | +41 21 ... | ECU            │ 🟢
│ 📦 Stock | 95 unités | ✅ SMS ✅ Email | ✅ CONFIRMÉ  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Caractéristiques:**
- Fond **vert clair**
- Bordure **verte**
- Badge statique: "✅ CONFIRMÉ"
- Pas d'animation
- Pas de bouton (action terminée)

#### 🟨 À RISQUE (Livré au client)

```
┌─────────────────────────────────────────────────────────┐
│ Pierre Lefevre | ... | ... | ... | 📨 Livré | 150 unités
│ Fond JAUNE, bordure ORANGE = HAUTE PRIORITÉ            │
└─────────────────────────────────────────────────────────┘
```

**Signification:** Le produit est déjà chez le client = urgence maximale!

---

## 🎮 Contrôles Utilisateur

### Avant Lancement

```
- Sélecteur Produit: ▼
- Sélecteur DLC: date picker
- Bouttons Sévérité: [LOW] [MEDIUM] [HIGH]
- Bouton: ▶ Lancer la simulation
```

### Pendant la Simulation

```
- ⏸ PAUSE:
  Arrête les confirmations clients automatiques
  Tous les chiffres se figent
  
- ▶ REPRENDRE:
  Redémarre les confirmations
  Les chiffres reprennent leurs mises à jour
  
- 🔄 RÉINITIALISER:
  Annule la simulation actuelle
  Revient à l'écran vide
  Libre de lancer une nouvelle simulation
```

### Dans le Tableau Clients

```
Filtre: ☐ Non confirmés uniquement
  Coche → affiche seulement les EN ATTENTE
  Décocche → affiche tous

Tri: ▼ Trier par...
  - Centre
  - Localisation
  - Client (nom)

Bouton "Confirmer" (EN ATTENTE seulement):
  Clique → client passe immédiatement à CONFIRMÉ
```

---

## 📊 Exemple de Scénario Complet

### Minute 0: Lancement

```
1. Sélectionner: Yaourt Nature XXX, DLC 15/01/2026, Sévérité MEDIUM
2. Cliquer: ▶ Lancer la simulation

Résultat:
  ✅ Confirmés: 0
  ⏳ En attente: 75
  📈 Taux: 0%
  
  Tous les clients EN ATTENTE affichent un fond rouge clignotant
```

### Minute 0-4: Simulation AUTO

```
Toutes les 2 secondes:
  - 1-3 clients aléatoires → CONFIRMÉS
  - UI mise à jour (couleur verte)
  - KPIs incrementent live

Après 4 minutes (120 secondes):
  ✅ Confirmés: 60
  ⏳ En attente: 15
  📈 Taux: 80%
```

### Minute 4: Pause

```
Utilisateur clique: ⏸ PAUSE

Résultat:
  - Confirmations s'arrêtent
  - KPIs gelés
  - Bouton devient: ▶ REPRENDRE
```

### Minute 6: Confirmation Manuelle

```
Utilisateur clique [Confirmer] sur les 15 clients restants

Résultat:
  ✅ Confirmés: 75
  ⏳ En attente: 0
  📈 Taux: 100%
```

---

## 🇨🇭 Données Suisses Intégrées

### Centres de Distribution

| Code | Nom | Adresse | Ville | Tél |
|------|-----|---------|-------|-----|
| ECU | Ecublens | Chemin du Croset 9, 1024 | Ecublens | +41 21 555 01 01 |
| PRAT | Pratteln | Zurlindenstrasse 1, 4133 | Pratteln | +41 61 555 02 02 |
| BREM | Bremgarten | Bahnhofstrasse 12, 5620 | Bremgarten | +41 56 555 03 03 |

### Clients par Centre

- **ECU:** 17 clients (c1-c17), tél +41 21 555 11 xx
- **PRAT:** 15 clients (c18-c32), tél +41 61 555 22 xx
- **BREM:** 18 clients (c33-c50), tél +41 56 555 33 xx

**Tous les numéros sont fictifs mais au format suisse authentique.**

---

## ⚙️ Options de Configuration (Dev)

Si vous voulez ajuster la simulation:

**File:** `app/qhse/page.tsx` (ligne ~43)

```typescript
useRealtimeSimulation(
  recall,
  {
    enabled: realtimeEnabled && !realtimePaused,
    intervalMs: 2000,              // ← Intervalle en ms (1000 = 1s)
    confirmationProbability: 0.3,   // ← 30% en condition normale
    worstCaseProbability: 0.1,      // ← 10% en pire cas
  },
  setRecall,
);
```

**Exemples:**
- `intervalMs: 1000` = confirmations plus fréquentes (1s)
- `confirmationProbability: 0.5` = plus de confirmations (50%)
- `confirmationProbability: 0.1` = moins de confirmations (10%)

---

## 🐛 Dépannage

### L'app ne redémarrt pas après réinitialisation

**Cause:** Un bug rare où l'état ne se réinitialise pas.  
**Solution:** Rafraîchir la page (F5 ou Cmd+R).

### Les animations clignotent trop vite

**Cause:** CSS animation trop rapide.  
**Solution:** Modifier `/app/qhse/page.module.css`:

```css
@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.2; }  /* ← Augmenter si trop clignotant */
  100% { opacity: 1; }
}

.blinkAnimation {
  animation: blink 2s ease-in-out infinite;  /* ← 1.2s → 2s */
}
```

### Les KPIs ne se mettent pas à jour

**Cause:** Simulation arrêtée ou en pause.  
**Solution:** Vérifier l'indicateur "🔴 Simulation EN COURS". Si "⏸ PAUSÉE", cliquer "▶ Reprendre".

---

## 📞 Support

Pour toute question ou amélioration:

1. Vérifier [ADAPTATION_SUISSE_REPORT.md](./ADAPTATION_SUISSE_REPORT.md)
2. Consulter le code dans `app/qhse/page.tsx`
3. Vérifier les logs du navigateur (F12 → Console)

---

## ✨ Bon à savoir

- ✅ La simulation est **100% frontend** (pas de serveur)
- ✅ Les données sont **fictives** (démo seulement)
- ✅ Aucune donnée réelle n'est envoyée
- ✅ L'app fonctionne **offline** (après chargement initial)
- ✅ Chaque rafraîchissement = nouvelle simulation

---

**Version:** 1.0  
**Date:** 12 Janvier 2026  
**Status:** 🟢 Prête pour Vercel

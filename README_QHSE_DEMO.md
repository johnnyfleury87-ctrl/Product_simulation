# 🚨 QHSE Recall Simulator - Guide Démo

## Vue d'ensemble

Une démo interactive d'un seul écran pour visualiser et simuler un rappel de produit du point de vue QHSE (Qualité, Hygiène, Sécurité, Environnement).

**Important:** C'est une démo fictive. Tous les produits, clients, et centrales sont générés automatiquement. Aucune sécurité n'est implémentée (pas de login, pas d'authentification).

---

## 🚀 Lancer la démo

### Prérequis
- Node.js 18+
- Workspace Product_simulation initialisé

### Installation rapide

```bash
# 1. À la racine du projet
npm install

# 2. Lancer le serveur de développement
npm run dev

# 3. Ouvrir dans le navigateur
# http://localhost:3000/qhse
```

---

## 🎮 Comment utiliser la démo

### Étape 1: Sélectionner un produit
- Dans la **colonne gauche**, déroulez la liste des produits
- Tous les produits sont fictifs (ex: "Yaourt Nature XXX", "Lait", "Pizzas surgelées")
- Chaque produit a une catégorie et un SKU

### Étape 2: Choisir une DLC (Date Limite de Consommation)
- Sélectionnez une date (défaut: demain)
- Cette date servira de périmètre du rappel

### Étape 3: Définir la sévérité
Trois niveaux :
- **LOW** (Faible) → 500-2000 unités, surtout en stock
- **MEDIUM** (Moyen) → 2000-8000 unités, répartition mixte
- **HIGH** (Élevée) → 8000-25000 unités, beaucoup livré aux clients

### Étape 4: Lancer la simulation
Cliquez sur **"▶ Lancer la simulation"**

→ La démo génère automatiquement :
- Un rappel avec ID unique
- Une répartition des unités concernées par localisation
- Une répartition par centre de distribution
- Une liste de 15-200 clients impactés (aléatoire selon sévérité)

---

## 📊 Comprendre le dashboard

### KPIs (Haut de page)
| KPI | Signification |
|-----|---------------|
| **Total unités concernées** | Nombre de produits affectés à retirer |
| **Clients impactés** | Nombre de clients avec au moins une commande affectée |
| **Centrales averties** | ✅ ou ❌ (click "Avertir les centrales" pour passer à ✅) |
| **Transport stoppé** | ✅ ou ❌ (click "Stop transport" pour confirmer l'arrêt) |

### Localisation du stock
Répartition des unités affectées en 4 zones :
- 📦 **En stock** : Entrepôt central (facile à retirer)
- 📋 **En préparation** : Commandes en cours de picking
- 🚚 **En transit** : En route vers les clients
- 📨 **Livré au client** : Déjà chez les clients (plus grave)

### Répartition par centre
3 centres de distribution fictifs :
- **Centre Île-de-France** (Paris)
- **Centre Rhône-Alpes** (Lyon)
- **Centre Nouvelle-Aquitaine** (Bordeaux)

Chaque centre a une proportion d'unités affectées proportionnelle à son volume quotidien.

---

## ⚡ Actions QHSE (simulation)

Dans la zone "Actions QHSE", vous pouvez déclencher des événements :

### 1️⃣ Avertir les centrales
- Bouton : `📢 Avertir les centrales`
- Effet : Passe à ✅ et enregistre le timestamp
- Simulation : Les centrales sont maintenant au courant

### 2️⃣ Stop transport
- Bouton : `🛑 Stop transport`
- Effet : Passe à ✅ et enregistre le timestamp
- Simulation : Tous les transports en cours sont bloqués

### 3️⃣ Envoyer SMS + Email
- Bouton : `📧 Envoyer SMS + Email`
- Effet : Envoie une notification simulée à tous les clients
- Résultat : Coche ✅ SMS et ✅ Email pour chaque client

### 4️⃣ Confirmer tous les clients
- Bouton : `Confirmer tous (X/Y)`
- Effet : Met tous les clients en attente à "Confirmé"
- Simulation : Les clients ont tous reçu le message et confirmé

---

## 👥 Tableau des clients impactés

### Colonnes
| Colonne | Infos |
|---------|-------|
| **Client** | Prénom + Nom (fictif) |
| **Email** | Email généré |
| **Téléphone** | Numéro fictif |
| **Centre** | Centre de distribution responsable |
| **Localisation** | 📦/📋/🚚/📨 (où se trouve le produit) |
| **Unités** | Nombre d'unités affectées pour ce client |
| **Notifications** | ✅ SMS / ✅ Email (changent après "Envoyer notifications") |
| **Statut** | ✅ Confirmé / ⏳ En attente (rouge clignotant si en attente) |
| **Action** | Bouton "Confirmer" (client par client) |

### Filtres et tri
- **"Non confirmés uniquement"** : Masquer les clients confirmés
- **"Trier par centre"** : Grouper par centre de distribution
- **"Trier par localisation"** : Grouper par zone (stock/transit/etc)
- **"Trier par client"** : Ordre alphabétique

### Codage couleur
- 🔴 **Ligne rouge clignotante** = Client non confirmé (urgent)
- 🟢 **Ligne verte** = Client confirmé
- 🔴 **Borure rouge** = Produit déjà livré au client (plus risqué)

---

## 📱 Scénarios de test recommandés

### Scénario 1: Rappel simple (LOW)
1. Choisir un produit (ex: "Yaourt Nature XXX")
2. Sévérité: **LOW**
3. Lancer
4. Résultat: ~500-2000 unités, surtout en stock, peu de clients
5. Actions: Avertir centrales → Stop transport → Envoyer SMS/Email → Confirmer tous

### Scénario 2: Rappel moyen (MEDIUM)
1. Produit: "Lait Demi-Écrémé"
2. Sévérité: **MEDIUM**
3. Lancer
4. Résultat: ~2000-8000 unités, répartition mixte, ~40-100 clients
5. Tester le filtrage "Non confirmés" et confirmer par client

### Scénario 3: Crise sanitaire (HIGH)
1. Produit: "Fromage Blanc"
2. Sévérité: **HIGH**
3. Lancer
4. Résultat: ~8000-25000 unités, beaucoup livré, ~100-200 clients
5. Simul ultime : confirmer un par un et voir le taux de confirmation grimper

---

## 🗂️ Structure des fichiers

```
/workspaces/Product_simulation/
├── data/
│   └── demoCatalog.ts          # 15 produits fictifs + 50 clients + 3 centres
├── lib/
│   └── simulateRecall.ts       # Moteur de simulation (génération impacts)
├── app/
│   └── qhse/
│       ├── page.tsx            # Composant React principal
│       └── page.module.css     # Styles (CSS Modules)
└── README_QHSE_DEMO.md        # Ce fichier
```

### Fichiers clés

**`data/demoCatalog.ts`**
- `DEMO_PRODUCTS` : 15 produits (Frais, Fruits, Surgelés, Secs, Volumineux)
- `DISTRIBUTION_CENTERS` : 3 centres (Paris, Lyon, Bordeaux)
- `DEMO_CUSTOMERS` : 50 clients répartis entre les 3 centres
- Fonctions helper : `getProductById()`, `getCustomersByDistributionCenter()`

**`lib/simulateRecall.ts`**
- `generateRecallSimulation()` : Lance une simulation complète
- `notifyCentrals()` : Marque centrales averties
- `confirmTransportStop()` : Arrête le transport
- `sendNotifications()` : Envoie SMS + Email simulés
- `confirmCustomer()` : Marque un client confirmé
- `confirmAllCustomers()` : Tous les clients confirmés
- Utilitaires : `groupImpactsByCenter()`, `groupImpactsByLocation()`, `getRecallStats()`

**`app/qhse/page.tsx`**
- Composant React "use client" (côté client uniquement)
- État : rappel courant, filtres, tri
- Rendu : formulaire + KPIs + actions + tableau

---

## 🎨 Design & UX

### Palette de couleurs
- **Primaire** : Dégradé violet (`#667eea` → `#764ba2`)
- **Succès** : Vert (`#10b981`)
- **Attention** : Orange (`#f59e0b`)
- **Danger** : Rouge (`#ef4444`)
- **Neutre** : Gris (`#6b7280`, `#9ca3af`)

### Animations
- Pulses rouges sur les cartes en attente
- Hover doux sur les boutons
- Transition des statuts

### Responsive
- Mobile : Une colonne, layout empilé
- Tablet : Adapte les grilles
- Desktop : 2 colonnes (formulaire + dashboard)

---

## ❓ FAQ

### Q: Les données sont-elles persistées?
**A:** Non. La démo est purement en mémoire (React state). Rafraîchir la page = réinitialisation.

### Q: Puis-je sauvegarder un rappel?
**A:** Pas dans cette démo. Pour une version prod, intégrer une API Supabase pour sauvegarder les rappels et impacts.

### Q: Pourquoi tous les clients ne sont-ils pas affectés?
**A:** C'est volontaire. Selon la sévérité, 15-200 clients sont sélectionnés au hasard (réaliste).

### Q: Puis-je modifier la date DLC après lancer?
**A:** Non. Relancer une nouvelle simulation pour tester une autre date.

### Q: Comment ajouter mes propres produits?
**A:** Éditer `data/demoCatalog.ts` et ajouter à `DEMO_PRODUCTS`.

---

## 🚀 Évolutions futures (si nécessaire)

1. **Persistance Supabase** : Enregistrer les rappels en BD
2. **Multi-utilisateurs** : Login + rôles (QHSE, Admin, Client)
3. **Export** : PDF/CSV des impacts
4. **Timeline** : Chronologie des actions
5. **Notifications réelles** : Webhook pour SMS/Email
6. **Dashboard analytics** : Graphiques temporels
7. **Mobile app** : App native pour confirmations clients

---

## 📞 Support

Cette démo est une **preuve de concept**. Elle montre :
✅ Comment structurer un rappel produit  
✅ Répartition par localisation et centre  
✅ Suivi des confirmations clients  
✅ Actions QHSE simulées  

Pour questions ou améliorations → Éditer les fichiers source.

---

**Version:** 1.0 | **Mode:** DÉMO | **Auth:** AUCUNE (démo uniquement)

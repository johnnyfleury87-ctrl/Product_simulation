# 🗂️ Index complet - QHSE Recall Simulator

## 📍 Structure du projet

```
/workspaces/Product_simulation/
│
├── 📄 QUICKSTART_QHSE.md          ← COMMENCEZ ICI (30 secondes)
├── 📄 README_QHSE_DEMO.md         ← Documentation complète
├── 📄 QHSE_DEMO_FILES.md          ← Récapitulatif fichiers créés
│
├── data/
│   └── demoCatalog.ts             ← Catalogue + clients + centres
│
├── lib/
│   └── simulateRecall.ts          ← Moteur de simulation
│
└── app/
    └── qhse/
        ├── page.tsx               ← Interface React (MAIN)
        └── page.module.css        ← Styles CSS
```

---

## 📚 Guide de lecture recommandé

### 1️⃣ **Pour démarrer immédiatement** (2 min)
📖 Lire: [QUICKSTART_QHSE.md](./QUICKSTART_QHSE.md)
- Commandes d'installation
- Premier test
- Scénarios rapides

### 2️⃣ **Pour comprendre la démo** (10 min)
📖 Lire: [README_QHSE_DEMO.md](./README_QHSE_DEMO.md)
- Vue d'ensemble complet
- Guide utilisateur détaillé
- Comprendre chaque KPI
- Actions QHSE expliquées
- FAQ

### 3️⃣ **Pour voir ce qui a été créé** (5 min)
📖 Lire: [QHSE_DEMO_FILES.md](./QHSE_DEMO_FILES.md)
- Fichiers nouveaux
- Contenu de chaque fichier
- Résumé des fonctionnalités

### 4️⃣ **Pour développer/modifier** (30 min)
👨‍💻 Code à explorer:

**Données:**
- [data/demoCatalog.ts](./data/demoCatalog.ts) → Ajouter produits/clients
- 50 clients fictifs + 3 centres + 15 produits

**Logique:**
- [lib/simulateRecall.ts](./lib/simulateRecall.ts) → Modifier la simulation
- Ajuster les distributions, ajouter actions

**Interface:**
- [app/qhse/page.tsx](./app/qhse/page.tsx) → Ajouter composants
- React state, handlers, rendu
- [app/qhse/page.module.css](./app/qhse/page.module.css) → Design

---

## 🎮 Workflow typique utilisateur

```
1. Ouvrir http://localhost:3000/qhse
   ↓
2. Sélectionner un produit (ex: "Yaourt")
   ↓
3. Choisir DLC + sévérité
   ↓
4. "Lancer la simulation"
   ↓
5. Dashboard s'affiche:
   • KPIs (unités, clients, centrales...)
   • Répartition (localisation + centre)
   • Actions (avertir, stopper, notifier)
   • Tableau des clients
   ↓
6. Cliquer actions:
   • "Avertir les centrales" ✅
   • "Stop transport" ✅
   • "Envoyer SMS + Email" ✅
   • Confirmer clients (un par un ou tous)
   ↓
7. Voir progression:
   • Clients non-confirmés = rouge clignotant
   • Clients confirmés = vert
   • Taux de confirmation en direct
   ↓
8. Relancer une autre simulation pour tester
```

---

## 🔍 Points clés du code

### Types TypeScript

```ts
// RecallSimulation
{
  id: "RECALL-..."
  product_id: "p1"
  product_name: "Yaourt XXX"
  dlc: "2026-01-15"
  severity: "HIGH" | "MEDIUM" | "LOW"
  total_units: 12400
  distribution_by_location: {
    stock: 2480,          // 20%
    preparation: 2480,    // 20%
    in_transit: 3100,     // 25%
    delivered: 4340       // 35%
  }
  distribution_by_center: {
    dc1: 4200,  // Île-de-France
    dc2: 4000,  // Rhône-Alpes
    dc3: 4200   // Nouvelle-Aquitaine
  }
  central_notified: false
  stop_confirmed_transport: false
  impacts: RecallImpact[]
}

// RecallImpact
{
  customer_id: "c1"
  product_id: "p1"
  dlc: "2026-01-15"
  location: "stock" | "preparation" | "in_transit" | "delivered"
  qty_units: 45
  distribution_center_id: "dc1"
  sms_sent: false
  email_sent: false
  client_confirmed: false
  timestamp_created: "2026-01-12T..."
  timestamp_notification: null
  timestamp_confirmed: null
}
```

### État React

```ts
recall: RecallSimulation | null         // Rappel courant
selectedProduct: string                 // ID produit
selectedDlc: string                     // Date YYYY-MM-DD
selectedSeverity: "LOW"|"MEDIUM"|"HIGH" // Sévérité
filterUnconfirmedOnly: boolean          // Filtre tableau
sortBy: "center"|"status"|"name"        // Tri tableau
```

### Actions principales

```ts
launchRecall()              // Génère nouvelle simulation
handleNotifyCentrals()      // central_notified = true
handleStopTransport()       // stop_confirmed_transport = true
handleSendNotifications()   // sms_sent + email_sent = true
handleConfirmCustomer(id)   // client_confirmed = true pour 1 client
handleConfirmAll()          // client_confirmed = true pour tous
```

---

## 🎨 Design expliqué

### Palette de couleurs

| Élément | Couleur | Utilité |
|---------|---------|---------|
| Primaire | `#667eea` (violet) | Boutons, headers, focus |
| Succès | `#10b981` (vert) | Actions confirmées, ✅ |
| Attention | `#f59e0b` (orange) | Avertissements, en cours |
| Danger | `#ef4444` (rouge) | Urgences, non-confirmés |
| Neutre | `#6b7280` (gris) | Texte, secondaire |

### Animations

- **Pulse rouge** : Clients non-confirmés (attraction visuelle)
- **Hover lift** : Boutons remontent légèrement au survol
- **Transition smooth** : 200ms sur tous les changements d'état
- **Shadows** : Profondeur 4-15px selon élément

### Layout

- **Desktop** : 2 colonnes (350px formulaire + 1fr dashboard)
- **Tablet/Mobile** : 1 colonne empilée
- **Tableau** : Scroll horizontal si petit écran
- **Cards** : Border-left colorée (sémantique)

---

## 📊 Données de simulation

### Répartition par sévérité

| Niveau | Unités | Clients | % En stock | % Transit | % Livré |
|--------|--------|---------|-----------|-----------|---------|
| LOW | 500-2000 | 15-35 | 60% | 10% | 10% |
| MEDIUM | 2000-8000 | 40-100 | 40% | 20% | 15% |
| HIGH | 8000-25000 | 100-200 | 20% | 25% | 35% |

### Répartition par centre

Proportionnel au volume quotidien moyen:
- **Île-de-France**: 2800 commandes/jour (40%)
- **Rhône-Alpes**: 2450 commandes/jour (35%)
- **Nouvelle-Aquitaine**: 2250 commandes/jour (32%)

### Clients

50 clients fictifs répartis:
- 17 clients Île-de-France
- 15 clients Rhône-Alpes
- 18 clients Nouvelle-Aquitaine

Chaque client a nom, email, téléphone générés.

---

## 🔧 Développement

### Ajouter un produit

Edit `data/demoCatalog.ts`:
```ts
DEMO_PRODUCTS.push({
  id: "p16",
  name: "Nouveau Produit",
  category: "Catégorie",
  sku: "PROD-016",
  unitType: "unité"
});
```

### Ajouter un client

Edit `data/demoCatalog.ts`:
```ts
DEMO_CUSTOMERS.push({
  id: "c51",
  nom: "Nouveau",
  prenom: "Client",
  email: "nouveau@email.com",
  telephone: "06 XX XX XX XX",
  distribution_center: "dc1"
});
```

### Changer la sévérité

Edit `lib/simulateRecall.ts`:
```ts
const LOCATION_DISTRIBUTION = {
  LOW: { stock: 0.7, preparation: 0.1, ... }, // ← Ajuster
  MEDIUM: { ... },
  HIGH: { ... }
};
```

### Modifier les styles

Edit `app/qhse/page.module.css`:
- Couleurs: Chercher `#667eea`, `#10b981`, etc.
- Layout: Chercher `.mainLayout { grid-template-columns: ... }`
- Animations: Chercher `@keyframes`

---

## 🚀 Commandes utiles

```bash
# Démarrage
npm run dev              # Lancer dev server
npm run build           # Build production
npm start               # Lancer prod server

# Vérification
npm run type-check      # Vérifier types TypeScript
npm run lint            # Linter le code

# Développement
npm run dev -- -p 3001  # Utiliser port 3001
```

---

## 📱 URLs à connaître

- **Démo QHSE** : `http://localhost:3000/qhse`
- **Accueil** : `http://localhost:3000/`
- **Dashboard** : `http://localhost:3000/dashboard` (si existant)
- **Logs** : `http://localhost:3000/logs` (si existant)

---

## ✅ Checklist de test

- [ ] Page charge sans erreur
- [ ] Sélectionner un produit
- [ ] Changer la date DLC
- [ ] Changer la sévérité
- [ ] Lancer simulation → Dashboard s'affiche
- [ ] KPIs affichent nombres corrects
- [ ] Avertir centrales → ✅
- [ ] Stop transport → ✅
- [ ] Envoyer notifications → Tous les ✅ SMS/Email
- [ ] Confirmer 1 client → Ligne passe au vert
- [ ] Confirmer tous → Toutes les lignes au vert
- [ ] Filtre "non-confirmés" → Masque les confirmés
- [ ] Tri par centre → Regroupe par centre
- [ ] Tableau scroll horizontal sur mobile
- [ ] Animations fonctionnent (pulse rouge, hover)

---

## 📞 Support / Questions

**Q: Pourquoi la page est vide au démarrage?**  
A: Normal! Sélectionne un produit et lance une simulation.

**Q: Où sont sauvegardées les données?**  
A: Nulle part. Mode démo = mémoire React uniquement. Rafraîchir = réinitialisation.

**Q: Comment ajouter mes propres produits/clients?**  
A: Édite `data/demoCatalog.ts`.

**Q: Puis-je brancher Supabase?**  
A: Oui, appelle une API dans `handleNotifyCentrals()` etc pour persister les rappels.

**Q: Les notifications SMS/Email sont-elles réelles?**  
A: Non, c'est simulé. Les checkboxes changent juste d'état.

**Q: Je veux modifier le design?**  
A: Edit `app/qhse/page.module.css`.

---

## 🎯 Prochaines étapes possibles

1. **Persistance**: Connecter à Supabase pour sauvegarder les rappels
2. **API**: Créer une API pour fetch produits/clients dynamiquement
3. **Export**: Ajouter bouton "Télécharger PDF" des impacts
4. **Multi-user**: Ajouter authentification et rôles
5. **Timeline**: Graphique de l'historique des actions
6. **Analytics**: Statistiques sur les temps de confirmation
7. **Mobile app**: React Native pour confirmations sur le terrain
8. **Webhooks**: Intégrations SMS/Email réels

---

**Dernière MAJ:** Janvier 2026 | **Mode:** Démo | **Version:** 1.0

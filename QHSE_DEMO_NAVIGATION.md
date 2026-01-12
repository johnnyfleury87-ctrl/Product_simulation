# 📂 Navigation fichiers - QHSE Demo

## 🎯 Pour commencer : 5 secondes

Lis dans cet ordre :

1. **[QHSE_DEMO_SUMMARY.md](./QHSE_DEMO_SUMMARY.md)** - Résumé exécutif (2 min)
2. **[QUICKSTART_QHSE.md](./QUICKSTART_QHSE.md)** - Lancer la démo (30 sec)
3. **[QHSE_VISUAL_GUIDE.md](./QHSE_VISUAL_GUIDE.md)** - À quoi ça ressemble (3 min)

Puis lance : `npm run dev` et visite `http://localhost:3000/qhse`

---

## 📖 Documentations

### Entrée main
| Fichier | Temps | Contenu |
|---------|-------|---------|
| **[QHSE_DEMO_SUMMARY.md](./QHSE_DEMO_SUMMARY.md)** | 2 min | Résumé complet: qu'est-ce qu'on a livré |
| **[QUICKSTART_QHSE.md](./QUICKSTART_QHSE.md)** | 30 s | Lancer la démo en 3 commandes |
| **[README_QHSE_DEMO.md](./README_QHSE_DEMO.md)** | 10 min | Doc complète: usage, KPIs, actions, FAQ |
| **[QHSE_VISUAL_GUIDE.md](./QHSE_VISUAL_GUIDE.md)** | 5 min | Mockups visuels, layouts, codage couleurs |

### Détails techniques
| Fichier | Temps | Contenu |
|---------|-------|---------|
| **[QHSE_DEMO_FILES.md](./QHSE_DEMO_FILES.md)** | 5 min | Quels fichiers ont été créés |
| **[QHSE_DEMO_INDEX.md](./QHSE_DEMO_INDEX.md)** | 15 min | Index complet + guide dev |
| **[QHSE_DEMO_NAVIGATION.md](./QHSE_DEMO_NAVIGATION.md)** | 3 min | Ce fichier |

---

## 💻 Fichiers de code

### Données
**[data/demoCatalog.ts](./data/demoCatalog.ts)** (282 lignes)
- 15 produits fictifs réalistes
- 50 clients avec emails/téléphones
- 3 centres de distribution
- Fonctions helpers pour recherche
- À éditer pour: ajouter produits/clients

### Logique
**[lib/simulateRecall.ts](./lib/simulateRecall.ts)** (321 lignes)
- `generateRecallSimulation()` - Crée un rappel avec impacts
- `notifyCentrals()` - Marque centrales averties
- `confirmTransportStop()` - Arrête les transports
- `sendNotifications()` - Envoie notifications
- `confirmCustomer()` / `confirmAllCustomers()` - Confirmations
- Utilitaires : groupement, statistiques
- À éditer pour: modifier logique de simulation

### Interface React
**[app/qhse/page.tsx](./app/qhse/page.tsx)** (373 lignes)
- Composant React "use client"
- Formulaire rappel (gauche)
- Dashboard KPIs (droite)
- Tableau clients (bas)
- État complètement managé en React
- À éditer pour: ajouter composants, modifier layout

### Styles
**[app/qhse/page.module.css](./app/qhse/page.module.css)** (520 lignes)
- CSS Modules (scoped)
- Palette: violet/vert/orange/rouge
- Animations: pulse, hover, transitions
- Responsive: Desktop/Tablet/Mobile
- À éditer pour: design, couleurs, animations

---

## 🗺️ Arborescence complète

```
/workspaces/Product_simulation/

📄 FICHIERS DOC (nouveaux)
├── QHSE_DEMO_SUMMARY.md         ← Résumé exécutif (commencez ici!)
├── QUICKSTART_QHSE.md           ← Lancer en 30 secondes
├── README_QHSE_DEMO.md          ← Documentation complète
├── QHSE_VISUAL_GUIDE.md         ← Mockups visuels
├── QHSE_DEMO_FILES.md           ← Fichiers créés
├── QHSE_DEMO_INDEX.md           ← Index + guide dev
├── QHSE_DEMO_NAVIGATION.md      ← Ce fichier
└── start-demo.sh                ← Script de lancement

📁 CODE (existant + nouveau)
├── data/
│   └── demoCatalog.ts           ← [NOUVEAU] Données fictives
├── lib/
│   ├── authSimulation.ts        ← [Existant]
│   ├── supabase.ts              ← [Existant]
│   ├── types.ts                 ← [Existant]
│   ├── useAuth.ts               ← [Existant]
│   └── simulateRecall.ts        ← [NOUVEAU] Moteur simulation
└── app/
    ├── qhse/                    ← [NOUVEAU] Démo QHSE
    │   ├── page.tsx             ← Interface React
    │   └── page.module.css      ← Styles
    ├── [autres routes existantes...]
    ├── layout.tsx               ← [Existant]
    ├── page.tsx                 ← [Existant]
    ├── globals.css              ← [Existant]
    └── api/
        └── [routes existantes...]

📦 CONFIG (existant)
├── package.json
├── tsconfig.json
├── next.config.js
├── vercel.json
└── [autres fichiers...]
```

---

## 🧭 Guide par profil

### 👤 Pour un manager/client
1. Lire [QHSE_DEMO_SUMMARY.md](./QHSE_DEMO_SUMMARY.md) (2 min)
2. Lancer : `npm run dev`
3. Tester : http://localhost:3000/qhse
4. Voir les 3 scénarios (LOW/MEDIUM/HIGH)

### 👨‍💻 Pour un développeur
1. Lire [QHSE_DEMO_INDEX.md](./QHSE_DEMO_INDEX.md) (15 min)
2. Explorer le code :
   - `data/demoCatalog.ts` (données)
   - `lib/simulateRecall.ts` (logique)
   - `app/qhse/page.tsx` (UI)
   - `app/qhse/page.module.css` (styles)
3. Modifier ce qui est besoin
4. Lancer : `npm run dev`

### 🎨 Pour un designer
1. Lire [QHSE_VISUAL_GUIDE.md](./QHSE_VISUAL_GUIDE.md) (5 min)
2. Éditer `app/qhse/page.module.css` pour les couleurs/animations
3. Tester : `npm run dev`

### 🧪 Pour un testeur
1. Lire [README_QHSE_DEMO.md](./README_QHSE_DEMO.md) (10 min)
2. Section "Scénarios de test recommandés"
3. Tester les 3 cas (LOW/MEDIUM/HIGH)
4. Vérifier la checklist dans [QHSE_DEMO_INDEX.md](./QHSE_DEMO_INDEX.md)

### 📊 Pour un PM/Product owner
1. Lire [QHSE_DEMO_SUMMARY.md](./QHSE_DEMO_SUMMARY.md) (2 min)
2. Lancer et tester (5 min)
3. Consulter [QHSE_DEMO_FILES.md](./QHSE_DEMO_FILES.md) pour ce qui a été livré

---

## ⚡ Commandes utiles

```bash
# Démarrage
npm run dev              # Lancer dev server (port 3000)
npm run build           # Build production
npm start               # Lancer prod

# Vérification
npm run type-check      # Vérifier types TypeScript
npm run lint            # Linter le code

# Dev avancé
npm run dev -- -p 3001  # Utiliser port 3001
rm -rf node_modules && npm install  # Réinitialiser

# Accès
http://localhost:3000/qhse     # Démo QHSE
http://localhost:3000/         # Accueil
http://localhost:3000/dashboard # Dashboard (si existant)
```

---

## 🔍 Recherche rapide

### Je veux... → Fichier
| Je veux | Fichier | Section |
|---------|---------|---------|
| Commencer maintenant | [QUICKSTART_QHSE.md](./QUICKSTART_QHSE.md) | Tout |
| Comprendre l'idée | [QHSE_DEMO_SUMMARY.md](./QHSE_DEMO_SUMMARY.md) | "Qu'est-ce qu'on a livré" |
| Utiliser la démo | [README_QHSE_DEMO.md](./README_QHSE_DEMO.md) | "Comment utiliser" |
| Voir le design | [QHSE_VISUAL_GUIDE.md](./QHSE_VISUAL_GUIDE.md) | "Layout principal" |
| Modifier les données | [data/demoCatalog.ts](./data/demoCatalog.ts) | DEMO_PRODUCTS, DEMO_CUSTOMERS |
| Modifier la logique | [lib/simulateRecall.ts](./lib/simulateRecall.ts) | generateRecallSimulation() |
| Modifier l'interface | [app/qhse/page.tsx](./app/qhse/page.tsx) | JSX render |
| Modifier les styles | [app/qhse/page.module.css](./app/qhse/page.module.css) | CSS |
| Ajouter un produit | [data/demoCatalog.ts](./data/demoCatalog.ts) | DEMO_PRODUCTS.push(...) |
| Ajouter un client | [data/demoCatalog.ts](./data/demoCatalog.ts) | DEMO_CUSTOMERS.push(...) |
| Changer les couleurs | [app/qhse/page.module.css](./app/qhse/page.module.css) | Chercher #667eea, #10b981 |
| Ajouter une action | [lib/simulateRecall.ts](./lib/simulateRecall.ts) | Créer nouvelle fonction |
| Debug | [QHSE_DEMO_INDEX.md](./QHSE_DEMO_INDEX.md) | "FAQ / Questions" |

---

## ✅ Checklist de lecture

Pour une compréhension complète, lire dans cet ordre :

- [ ] [QHSE_DEMO_SUMMARY.md](./QHSE_DEMO_SUMMARY.md) - 2 min
- [ ] [QUICKSTART_QHSE.md](./QUICKSTART_QHSE.md) - 30 sec
- [ ] [QHSE_VISUAL_GUIDE.md](./QHSE_VISUAL_GUIDE.md) - 5 min
- [ ] [README_QHSE_DEMO.md](./README_QHSE_DEMO.md) - 10 min
- [ ] [QHSE_DEMO_FILES.md](./QHSE_DEMO_FILES.md) - 5 min
- [ ] [QHSE_DEMO_INDEX.md](./QHSE_DEMO_INDEX.md) - 15 min

**Total**: ~40 minutes pour la doc complète

Puis lancer : `npm run dev` et explorer la démo (~10 min)

**Temps total pour "maîtriser"**: ~1 heure

---

## 🎯 Points de départ selon l'usage

### Pour tester immédiatement
```
1. QUICKSTART_QHSE.md
2. npm run dev
3. http://localhost:3000/qhse
4. Choisir produit → Lancer simulation
```
**Temps: 1 minute**

### Pour comprendre le concept
```
1. QHSE_DEMO_SUMMARY.md
2. QHSE_VISUAL_GUIDE.md
3. Tester la démo
```
**Temps: 10 minutes**

### Pour développer/personnaliser
```
1. QHSE_DEMO_INDEX.md
2. Lire le code source
3. Éditer et relancer
```
**Temps: 30 minutes**

### Pour supporter/documenter
```
1. README_QHSE_DEMO.md
2. QHSE_DEMO_FILES.md
3. FAQ dans QHSE_DEMO_INDEX.md
```
**Temps: 20 minutes**

---

## 🆘 Problèmes fréquents

| Problème | Solution | Fichier |
|----------|----------|---------|
| "Port 3000 utilisé" | `npm run dev -- -p 3001` | [QUICKSTART_QHSE.md](./QUICKSTART_QHSE.md) |
| "Module not found" | `rm -rf node_modules && npm install` | [README_QHSE_DEMO.md](./README_QHSE_DEMO.md) |
| "Compilation error" | `npm run type-check` | [QHSE_DEMO_INDEX.md](./QHSE_DEMO_INDEX.md) |
| "Page vide" | Normal! Lancer d'abord une simulation | [README_QHSE_DEMO.md](./README_QHSE_DEMO.md) |
| "Comment modifier X" | Chercher dans [QHSE_DEMO_INDEX.md](./QHSE_DEMO_INDEX.md) section "Développement" | Tableaux au-dessus |

---

## 📞 Support

- **Questions générales** → [README_QHSE_DEMO.md](./README_QHSE_DEMO.md) FAQ
- **Guide développeur** → [QHSE_DEMO_INDEX.md](./QHSE_DEMO_INDEX.md)
- **Visuel/Design** → [QHSE_VISUAL_GUIDE.md](./QHSE_VISUAL_GUIDE.md)
- **Ce qu'a été livré** → [QHSE_DEMO_FILES.md](./QHSE_DEMO_FILES.md)
- **Résumé exécutif** → [QHSE_DEMO_SUMMARY.md](./QHSE_DEMO_SUMMARY.md)

---

**Navigation mise à jour:** Janvier 2026 | **Doc complète:** 6 fichiers | **Code:** 4 fichiers

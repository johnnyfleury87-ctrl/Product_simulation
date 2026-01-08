# Simulation Traçabilité Produits & DLC

Implémentation complète du système de simulation **Traçabilité Produits & DLC** basé sur le PDF "PROJET SIMULATION traca.pdf".

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- Supabase CLI
- PostgreSQL (local ou cloud)

### Installation

```bash
# 1. Cloner et installer
git clone <repo>
cd Product_simulation
npm install

# 2. Copier .env.local et remplir vos clés Supabase
cp .env.local.example .env.local

# 3. Démarrer Supabase local (optionnel)
supabase start

# 4. Appliquer migrations
supabase db push

# 5. Charger données démo
npm run db:seed

# 6. Démarrer le dev server
npm run dev
```

Ensuite, aller à http://localhost:3000

## 📋 Comptes démo

| Rôle | Email | Mot de passe |
|------|-------|---|
| Admin | demo.admin@example.com | demo123456 |
| Production | demo.production@example.com | demo123456 |
| Client | demo.client@example.com | demo123456 |
| Fournisseur | demo.fournisseur@example.com | demo123456 |
| On-call | demo.oncall@example.com | demo123456 |

## 📁 Structure du projet

```
Product_simulation/
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx               # Layout global
│   ├── page.tsx                 # Accueil (redirection)
│   ├── login/                   # Page login
│   ├── dashboard/               # Control Tower (Admin)
│   ├── production/              # Vue Production
│   ├── client/                  # Vue Client
│   ├── fournisseur/             # Vue Fournisseur
│   ├── oncall/                  # Vue On-call
│   ├── logs/                    # Vue Logs
│   └── api/                     # API routes
│       ├── auth/                # Authentification
│       ├── scan/                # Réception (receive_scan RPC)
│       ├── orders/              # Commandes
│       ├── recalls/             # Rappels
│       ├── notifications/       # Notifications
│       └── simulation/          # Simulation engine
├── lib/
│   ├── supabase.ts             # Client Supabase (client-side)
│   ├── supabaseServer.ts       # Client Supabase (server-side)
│   └── types.ts                # Types TypeScript
├── supabase/
│   ├── migrations/             # Migrations SQL
│   └── seed/                   # Données initiales
├── docs/
│   ├── architecture_complete.md
│   ├── workflow_metier.md
│   ├── scenarios_demo.md
│   └── CHANGELOG_SIMULATION.md
└── package.json
```

## 🔑 Architecture clé

### Rôles & Permissions (RLS)
- **Admin**: accès total
- **Production**: réception, mouvements stock, blocage lots
- **Client**: voir ses commandes, confirmer rappels
- **Fournisseur**: créer rappels, voir impact
- **On-call**: gérer escalades, confirmer contacts

### RPC Supabase (logique métier en DB)
- `receive_scan(product_code, lot_code, dlc, qty)` → scan réception
- `allocate_fefo(order_id)` → allocation FEFO automatique
- `create_recall_by_dlc_window(product_id, dlc_ref, severity)` → fenêtre ±3j
- `acknowledge_recall_notification(notification_id)` → ACK escalade
- `trigger_escalation_if_timeout(recall_id)` → escalade auto

### Simulation (400 commandes/jour × 7 jours)
- Moteur générant 2800 commandes sur 7 jours
- FEFO automatique
- Escalade si non-confirmation après 10 min (simulé)
- Accélération temps (10 sec = 10 min)

## 📖 Documentation

- **[architecture_complete.md](./docs/architecture_complete.md)**: Architecture système détaillée
- **[workflow_metier.md](./docs/workflow_metier.md)**: Workflows métier (8 flux)
- **[scenarios_demo.md](./docs/scenarios_demo.md)**: 8 scénarios de test concrets
- **[CHANGELOG_SIMULATION.md](./docs/CHANGELOG_SIMULATION.md)**: Journal implémentation complète

## 🧪 Tests

```bash
# Lancer les scénarios de test
npm run test:scenarios

# Voir les logs d'événements
curl http://localhost:3000/api/events
```

## 🚀 Déploiement

### Vercel (frontend)
```bash
vercel deploy
```

### Supabase (database)
```bash
supabase link --project-ref YOUR_PROJECT_ID
supabase db push --dry-run  # Vérifier avant
supabase db push            # Appliquer en prod
```

## 📌 Points clés

✅ **DLC protégée**: créée seul au scan, jamais modifiable
✅ **FEFO automatique**: allocation des lots les plus proches de l'expiration
✅ **Traçabilité complète**: tous les mouvements loggés
✅ **Escalade intelligente**: SMS → email → appel → on-call
✅ **Simulation réaliste**: 2800 commandes en 7 jours
✅ **Sécurité**: RLS par rôle, RPC pour logique métier

## ⚠️ Notes pour développement

- Les notifications (SMS, email, appel) sont **simulées** en démo
- L'escalade fonctionne en **temps simulé**: 10 sec = 10 min
- Les comptes démo sont **pré-créés** en seed
- Données demo = 50 clients, 75 lots, 5 gammes

## 📞 Support

Voir `docs/CHANGELOG_SIMULATION.md` pour:
- Les 4 décisions DÉMO appliquées
- Les incohérences détectées et propositions
- Le journal complet d'implémentation
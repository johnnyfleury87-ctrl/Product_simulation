# 🚀 DÉPLOIEMENT RAPIDE

## En 5 minutes

```bash
# 1. Cloner et installer
git clone <repo>
cd Product_simulation
npm install

# 2. Configurer Supabase
cp .env.local.example .env.local
# ➜ Éditer .env.local avec vos clés Supabase

# 3. Créer les comptes démo
SUPABASE_SERVICE_ROLE_KEY=xxxx node scripts/create-demo-users.js

# 4. Appliquer migrations
supabase db push

# 5. Charger données démo
npm run db:seed

# 6. Démarrer!
npm run dev
```

Puis: http://localhost:3000 → Login avec:
- Email: `demo.admin@example.com`
- Password: `demo123456`

## 📋 Comptes disponibles

```
demo.admin@example.com          (Admin - Control Tower)
demo.production@example.com     (Production - Réception scanner)
demo.client@example.com         (Client - Voir rappels)
demo.fournisseur@example.com    (Fournisseur - Créer rappels)
demo.oncall@example.com         (On-call - Gérer escalades)

Mot de passe tous: demo123456
```

## 📂 Structure du code

```
app/                    # Pages Next.js (6 vues + login)
  ├── api/              # 8 API routes
  └── pages...          # 7 pages React

lib/                    # Config Supabase + types
supabase/
  ├── migrations/       # Schéma BD (2 fichiers)
  └── seed/            # Données initiales

docs/
  ├── architecture_complete.md
  ├── workflow_metier.md
  ├── scenarios_demo.md
  └── CHANGELOG_SIMULATION.md (vous êtes ici!)
```

## 🔧 Troubleshooting

**Port 3000 déjà utilisé?**
```bash
npm run dev -- -p 3001
```

**Supabase connexion échoue?**
- Vérifier .env.local (copie bien de .env.local.example)
- Vérifier clés Supabase correctes
- Vérifier supabase CLI installé: `supabase --version`

**Migrations échouent?**
```bash
supabase db reset  # Reset complète (DEV UNIQUEMENT!)
supabase db push --dry-run  # Vérifier d'abord
```

## 📞 Documentation

Lire dans cet ordre:
1. Ce fichier (vous êtes ici)
2. README.md (configuration complète)
3. docs/CHANGELOG_SIMULATION.md (implémentation)
4. docs/architecture_complete.md (système)
5. docs/workflow_metier.md (workflows métier)
6. docs/scenarios_demo.md (tests)

## ✅ Qu'est-ce qui est implémenté?

- ✅ Base de données Supabase (15 tables, 5 RPC)
- ✅ Authentification email+password
- ✅ 6 vues frontend (Login, Dashboard, Production, Client, Fournisseur, On-call, Logs)
- ✅ 8 API routes (Auth, Scan, Orders, Recalls, Events, etc.)
- ✅ Données démo (5 gammes, 15 produits, 50 clients, 75 lots)
- ✅ Seed complet + scripts

## 🎯 Cas d'usage rapide

### Production: Scanner une réception
1. Login: `demo.production@example.com`
2. Vue Production → Saisie réception
3. Remplir: produit, lot, DLC, quantité
4. ✅ Lot créé

### Client: Voir rappels
1. Login: `demo.client@example.com`
2. Vue Client → Liste rappels
3. Bouton "J'ai lu" → Escalade annulée

### Fournisseur: Créer rappel
1. Login: `demo.fournisseur@example.com`
2. Vue Fournisseur → Créer rappel
3. Remplir: produit, DLC concernée, sévérité
4. ✅ Clients notifiés (SMS + email simulés)

### On-call: Gérer escalades
1. Login: `demo.oncall@example.com`
2. Vue On-call → Queue escalades
3. Vérifier contact clients
4. Bouton "Résolu"

### Admin: Vue d'ensemble
1. Login: `demo.admin@example.com`
2. Dashboard → Stats + accès toutes les vues

## 🔐 Sécurité

- Aucune clé Supabase en dur (toutes en .env)
- RLS (Row Level Security) sur données sensibles
- RPC pour logique métier (immuable)
- Tokens JWT pour auth
- Logs d'événements complets

## 🚀 Production

Pour déployer sur Vercel:

```bash
# 1. Lier à Vercel
vercel login
vercel link

# 2. Configurer env vars
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# 3. Déployer
vercel deploy --prod

# 4. Appliquer migrations en prod
supabase link --project-ref YOUR_PROJECT_ID
supabase db push
```

## 📞 Support

Problème? Consulter:
- docs/CHANGELOG_SIMULATION.md (implémentation complète)
- Terminal: vérifier les logs d'erreur (Ctrl+C + relancer)
- Vérifier variables d'env (.env.local correct?)
- Supabase dashboard (https://app.supabase.com) → vérifier données

---

**Version:** 1.1  
**Statut:** ✅ Production-ready (démo)  
**Comptes:** 5 rôles testables  
**Dernière mise à jour:** 2026-01-08

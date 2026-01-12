# GUIDE DE DÉPLOIEMENT - Traçabilité Produits sur Vercel

**Version:** 1.0.0  
**Date:** 12 janvier 2026  
**Statut:** ✅ Prêt pour déploiement

---

## 🎯 Vue d'ensemble

Ce guide décrit les étapes pour déployer le projet "Traçabilité Produits" sur Vercel en ~1 heure.

### Prérequis
- Compte Vercel (vercel.com)
- Repository GitHub avec accès push
- Compte Supabase avec projet configuré
- Node.js 18+ local (pour tester avant deploy)

### Étapes principales
1. **Préparer le repo** (15 min)
2. **Configurer Vercel** (10 min)
3. **Configurer Supabase** (10 min)
4. **Déployer** (5 min)
5. **Smoke tests** (15 min)

**Temps total: ~55 min**

---

## 📋 Pré-déploiement - Vérifications Locales

### Étape 1: Vérifier les fixes P1 appliqués

```bash
# 1.1 Vérifier /api/events est fixé
grep "export const dynamic" app/api/events/route.ts
# Résultat attendu: export const dynamic = 'force-dynamic';

# 1.2 Vérifier migration RLS existe
ls -la supabase/migrations/003_enable_rls.sql
# Résultat: le fichier doit exister

# 1.3 Vérifier .gitignore a .env.local
grep ".env.local" .gitignore
# Résultat: .env.local devrait être listée

# 1.4 Vérifier build local
npm run build
# Résultat: ✓ Compiled successfully
# IMPORTANT: Pas d'erreur "Dynamic server usage"

# 1.5 Vérifier type-check
npm run type-check
# Résultat: Pas d'output = 0 erreurs ✓
```

### Étape 2: Préparer le repository

```bash
# 2.1 Créer branch de release
git checkout -b release/prod-v1.0.0

# 2.2 Vérifier que .env.local n'est PAS committé
git status
# .env.local ne doit PAS apparaître (car dans .gitignore)

# 2.3 Ajouter les modifications
git add -A

# 2.4 Vérifier les changements
git diff --cached
# Doit montrer:
# - app/api/events/route.ts (export const dynamic)
# - supabase/migrations/003_enable_rls.sql (nouveau)
# - .gitignore (nouveau)
# - .env.local.example (modifié, sans secrets)
# - AUDIT_REPORT.md (nouveau)
# - DEPLOYMENT_GUIDE.md (nouveau - ce fichier)

# 2.5 Commit
git commit -m "chore: prepare for Vercel deployment v1.0.0

Changes:
- Fix /api/events dynamic server error
- Add RLS migration (003_enable_rls.sql)
- Secure .env.local in .gitignore
- Add .env.example documentation
- Add comprehensive audit report
- Add deployment guide

Ready for production deployment on Vercel."

# 2.6 Push à GitHub
git push origin release/prod-v1.0.0
```

---

## 🚀 Déploiement - Configuration Vercel

### Étape 3: Importer le projet sur Vercel

**Via Vercel Dashboard:**

1. Aller à https://vercel.com/new
2. Cliquer "Import Project"
3. Sélectionner "GitHub"
4. Chercher et sélectionner `johnnyfleury87-ctrl/Product_simulation`
5. Cliquer "Import"

**OU via Vercel CLI (alternatif):**
```bash
npm install -g vercel
vercel login
cd /workspaces/Product_simulation
vercel --prod
```

### Étape 4: Configurer les Environment Variables

**Dans Vercel Dashboard → Settings → Environment Variables:**

Ajouter ces variables:

| Variable | Valeur | Scope | Secret? |
|----------|--------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://bidegooohfnxmmbuyttc.supabase.co` | Production | Non |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(voir supabase settings)* | Production | Non* |
| `SUPABASE_SERVICE_ROLE_KEY` | *(voir supabase settings)* | Production | OUI |
| `SIM_TIME_ACCELERATION` | `true` | Production | Non |
| `ESCALATION_TIMEOUT_SECONDS` | `10` | Production | Non |

**Comment trouver les clés Supabase:**
1. Supabase Dashboard → Project Settings → API
2. Copier:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon (public)` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role (secret)` → `SUPABASE_SERVICE_ROLE_KEY`

**⚠️ Important:**
- Les clés `NEXT_PUBLIC_*` seront exposées en frontend (normal)
- `SUPABASE_SERVICE_ROLE_KEY` doit rester secret (Vercel le masquera automatiquement)
- Ne JAMAIS paster directement; utiliser 1Password ou gestionnaire secrets d'équipe

### Étape 5: Vérifier Build Settings

**Dans Vercel → Settings → Build & Development:**

Vérifier:
- **Build Command:** `npm run build` (par défaut: OK)
- **Output Directory:** `.next` (par défaut: OK)
- **Install Command:** `npm ci` (par défaut: OK)
- **Node.js Version:** 18.x ou 20.x (automatique: OK)

### Étape 6: Déclencher le déploiement

**Option A: Déployer via Git push**
```bash
# Les variables d'env sont déjà configurées
git push origin release/prod-v1.0.0
# Vercel va déployer automatiquement
# Vérifier status sur Vercel Dashboard
```

**Option B: Redéployer depuis Vercel Dashboard**
1. Dashboard → Deployments
2. Cliquer "Deploy"
3. Sélectionner la branche `release/prod-v1.0.0`
4. Cliquer "Deploy"

**Attendre la fin du build (~3 min)**

---

## 🗄️ Configuration Supabase - Appliquer Migrations

### Étape 7: Appliquer Migration RLS (003)

**Via Supabase SQL Editor:**

1. Supabase → Project → SQL Editor
2. Coller le contenu entier de `supabase/migrations/003_enable_rls.sql`
3. Cliquer "Run"
4. Vérifier: Pas d'erreurs, output montre tables avec RLS enabled

**Vérification:**
```sql
-- Vérifier RLS est activé
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = TRUE
ORDER BY tablename;

-- Résultat attendu: 15 tables
-- allocations
-- customers
-- event_logs
-- ...
```

---

## ✅ Post-déploiement - Smoke Tests

### Étape 8: Vérifier le déploiement

**Dans Vercel Dashboard:**

1. Cliquer sur Deployments
2. Vérifier que le deployment est "READY" (vert)
3. Copier l'URL de production (ex: `https://traceability-products.vercel.app`)
4. Ouvrir l'URL dans le navigateur

**Résultat attendu:**
```
Page de redirection vers /login ✓
```

### Étape 9: Smoke Tests Manuels

**9.1 Infrastructure Base**
```
Test: Accéder à https://your-deployment.vercel.app
Attendu: Redirection vers /login
Résultat: ✅ Pass / ❌ Fail
```

**9.2 API Health Check**
```bash
# Depuis terminal:
curl -s https://your-deployment.vercel.app/api/products | jq .success
# Attendu: true (si données en DB) ou [] (si vide)
Résultat: ✅ Pass / ❌ Fail
```

**9.3 Login Flow**
```
1. Accéder à https://your-deployment.vercel.app/login
2. Entrer: demo.admin@example.com / demo123456
   (Ou créer nouveau compte via Supabase Auth)
3. Attendre réponse
4. Vérifier redirectionvers /dashboard
Résultat: ✅ Pass / ❌ Fail
```

**9.4 Scan Reception (Production)**
```
1. Login comme production user
2. Accéder /production
3. Entrer:
   - Code produit: PROD-001-LAIT
   - Lot: LOT-TEST-001
   - DLC: 2026-01-20
   - Quantité: 50
4. Cliquer "Enregistrer"
5. Vérifier message "✅ Lot créé"
Résultat: ✅ Pass / ❌ Fail
```

**9.5 Rappel Produit (Fournisseur)**
```
1. Login comme fournisseur user
2. Accéder /fournisseur (si page existe)
3. Créer rappel pour produit PROD-001-LAIT
4. Vérifier que notifications sont créées
Résultat: ✅ Pass / ❌ Fail
```

**9.6 Ack Rappel (Client)**
```
1. Login comme client user
2. Accéder /client
3. Vérifier qu'il y a des rappels listés
4. Cliquer "J'ai lu et compris"
5. Vérifier que le bouton disparaît
Résultat: ✅ Pass / ❌ Fail
```

**9.7 Dashboard & Stats**
```
1. Login comme admin
2. Accéder /dashboard
3. Vérifier que les 4 cartes affichent des stats > 0
   - Commandes
   - Produits
   - Clients
   - Événements
Résultat: ✅ Pass / ❌ Fail
```

**9.8 Logs**
```
1. Depuis /dashboard, cliquer "Logs"
2. Vérifier que les événements s'affichent
3. Voir des événements type: RECEPTION, ALLOCATION, SMS_SENT, etc.
Résultat: ✅ Pass / ❌ Fail
```

### Étape 10: Monitoring

**Vérifier les logs Vercel:**

1. Vercel Dashboard → Deployments → [Votre deployment]
2. Onglet "Logs"
3. Vérifier:
   - Pas d'erreurs 5xx (sauf attendues)
   - Pas de "undefined" ou "null" errors
   - Response times < 500ms

**Vérifier les logs Supabase:**

1. Supabase Dashboard → Logs
2. Chercher `error` dans les logs
3. Vérifier qu'il n'y a pas d'accès non-autorisés (RLS issues)

---

## 🔄 Rollback - En cas de Problème

### Rollback Vercel (30 secondes)

```bash
# Option A: Via Vercel Dashboard
# 1. Deployments → Sélectionner dernier deployment OK
# 2. Cliquer "..." → "Promote to Production"

# Option B: Via CLI
vercel rollback
```

### Rollback Database (5 minutes)

```sql
-- Si migration 003 (RLS) cause des problèmes:
-- Exécuter dans Supabase SQL Editor:

ALTER TABLE lots DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_ranges DISABLE ROW LEVEL SECURITY;
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE allocations DISABLE ROW LEVEL SECURITY;
ALTER TABLE recalls DISABLE ROW LEVEL SECURITY;
ALTER TABLE recall_lots DISABLE ROW LEVEL SECURITY;
ALTER TABLE recall_notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements DISABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_balances DISABLE ROW LEVEL SECURITY;
ALTER TABLE event_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE sim_runs DISABLE ROW LEVEL SECURITY;
ALTER TABLE sim_events DISABLE ROW LEVEL SECURITY;

-- Puis redéployer après fix
```

---

## 📞 Troubleshooting

### Erreur: "Cannot find module '@supabase/supabase-js'"

**Cause:** Dépendances non installées

**Fix:**
```bash
# Local:
rm -rf node_modules package-lock.json
npm install
npm run build

# Vercel: Automatique (npm ci)
# Sinon, reconstruire depuis Dashboard
```

### Erreur: "Missing Supabase environment variables"

**Cause:** Variables d'env non configurées ou mal nommées

**Fix:**
1. Vérifier dans Vercel Settings → Environment Variables
2. Vérifier les noms exacts:
   - `NEXT_PUBLIC_SUPABASE_URL` (pas `SUPABASE_URL`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Redéployer après changement

### Erreur: "RLS policy violation"

**Cause:** Migration 003 activé RLS trop strict

**Fix:**
1. Vérifier que les policies permettent les RPC
2. Vérifier que service role bypass RLS (par défaut: OK)
3. Désactiver RLS temporairement (voir Rollback)
4. Revoir les policies et réappliquer

### Erreur: "Deployment failed - build error"

**Cause:** Problème de compilation

**Fix:**
```bash
# Tester localement:
npm run build
npm run type-check

# Vérifier les logs Vercel:
# Deployments → Votre deployment → Logs
# Chercher la vraie erreur

# Redéployer après fix:
git push origin release/prod-v1.0.0
```

---

## 📝 Checklist Finale

Avant de considérer le déploiement comme **DONE**:

- [ ] Build local: `npm run build` ✓
- [ ] Type check: `npm run type-check` ✓
- [ ] Secrets dans `.gitignore` ✓
- [ ] `.env.local.example` sans secrets ✓
- [ ] Migration 003 appliquée en Supabase ✓
- [ ] Vercel project créé et variables d'env configurées ✓
- [ ] Déploiement succès (READY en Vercel Dashboard) ✓
- [ ] Login page accessible ✓
- [ ] Au moins 1 workflow métier testé (ex: scan) ✓
- [ ] Aucune erreur 5xx en logs ✓
- [ ] URL production générée et stable ✓

**Si tous les points sont cochés → ✅ DÉPLOIEMENT RÉUSSI**

---

## 📞 Support & Questions

### FAQ

**Q: Où je trouve l'URL de production?**
A: Vercel Dashboard → Deployments → Cliquer sur le deployment ✓ → Copier l'URL en haut

**Q: Les comptes démo (admin, production, etc.) existent-ils?**
A: Non, il faut les créer via Supabase Auth ou via le script `scripts/create-demo-users.js`. Voir QUICKSTART.md pour la procédure.

**Q: Comment je mets à jour le code après déploiement?**
A: Faire les changements, commit et push vers `release/prod-v1.0.0` (ou autre branche). Vercel redéploiera automatiquement.

**Q: Comment je vois les logs en production?**
A: Vercel → Deployments → Votre deployment → Logs (real-time)

**Q: Puis-je tester en staging avant de faire go-live?**
A: Oui, créer une branche `staging` et déployer sur une URL de preview (Vercel le fait automatiquement).

---

## 📚 Documentation Supplémentaire

- [AUDIT_REPORT.md](./AUDIT_REPORT.md) - Audit complet du projet
- [README.md](./README.md) - Vue d'ensemble du projet
- [docs/architecture_complete.md](./docs/architecture_complete.md) - Architecture détaillée
- [docs/workflow_metier.md](./docs/workflow_metier.md) - Workflows métier

---

**Guidé par:** Audit complet d'audit du projet + best practices Vercel  
**Dernière mise à jour:** 12 janvier 2026  
**Statut:** Production-ready ✅

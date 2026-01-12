## 🚀 QUICKSTART - MODE SIMULATION (APRÈS FIX)

**Date:** Janvier 12, 2026  
**Status:** ✅ Prêt à tester

---

## ⚡ Démarrage Rapide

### 1. **Démarrer l'app**
```bash
cd /workspaces/Product_simulation
npm install  # Si pas fait
npm run dev
```

Ouvre: http://localhost:3000

### 2. **Accéder au login**
Vous serez automatiquement redirigé vers `/login`

### 3. **Se connecter (MODE DÉMO)**
```
Email: n'importe lequel (ex: test@example.com)
Password: demo   OU   demo123456
```

### 4. **Naviguer partout**
Cliquez sur les liens de navigation, aucune restriction ! 🎉

---

## 📋 Comptes Démo (Tous Fonctionnent)

| Email | Rôle | Password | Notes |
|-------|------|----------|-------|
| `demo.admin@example.com` | Admin | demo | Accès complet |
| `demo.production@example.com` | Production | demo | Accès complet |
| `demo.client@example.com` | Client | demo | Accès complet |
| `demo.fournisseur@example.com` | Fournisseur | demo | Accès complet |
| `demo.oncall@example.com` | On-call | demo | Accès complet |
| **N'importe quel autre email** | Admin | demo | Accepté aussi ! |

**Password:** Accepte `demo` OU `demo123456` (les deux)

---

## 🎯 Vues Accessibles

Après connexion, vous pouvez accéder à:

| Vue | Route | Statut |
|-----|-------|--------|
| Dashboard | `/dashboard` | ✅ Pas de guard |
| Production | `/production` | ✅ Guard supprimé |
| Client | `/client` | ✅ Pas de guard |
| Fournisseur | `/fournisseur` | ✅ Pas de guard |
| On-call | `/oncall` | ✅ Pas de guard |
| Logs | `/logs` | ✅ Pas de guard |

---

## 🔧 Fichiers Modifiés (Résumé)

### Créés:
- ✨ `lib/authSimulation.ts` - Mode démo
- ✨ `lib/useAuth.ts` - Hook réutilisable
- 📄 `SIMULATION_AUTH_REPORT.md` - Documentation complète

### Modifiés (6 fichiers):
- `app/api/auth/login/route.ts` - Remplacé Supabase par simulation
- `app/login/page.tsx` - Redirection simplifiée + docs
- `app/dashboard/page.tsx` - Accepte simulated_user
- `app/production/page.tsx` - Guard supprimé ⭐
- `app/fournisseur/page.tsx` - Accepte simulated_user
- `app/client/page.tsx` - Accepte simulated_user
- `app/oncall/page.tsx` - Accepte simulated_user
- `app/logs/page.tsx` - Accepte simulated_user

---

## 🎬 Scénarios de Test

### ✅ Test 1: Connexion Basique
```
1. Accès http://localhost:3000
2. Redirigé vers /login
3. Email: john@test.fr
4. Password: demo
5. ✅ Arrive sur dashboard
6. Pas d'erreur 401
```

### ✅ Test 2: Navigation Complète
```
1. Dashboard → Cliquer Production
2. Production → Cliquer Fournisseur
3. Fournisseur → Cliquer Client
4. Client → Cliquer On-call
5. On-call → Cliquer Logs
6. Logs → Cliquer Dashboard
✅ Toutes les transitions fonctionnent
```

### ✅ Test 3: Accès Direct par URL
```
- /dashboard → ✅ Charge
- /production → ✅ Charge
- /client → ✅ Charge
- /fournisseur → ✅ Charge
- /oncall → ✅ Charge
- /logs → ✅ Charge
```

### ✅ Test 4: Gestion Erreur
```
1. Déconnexion (localStorage clear)
2. Tentative d'accès /dashboard
3. ✅ Redirigé vers /login
4. Email: test@example.com
5. Password: wrongpass
6. ✅ Message d'erreur clair
7. Password: demo
8. ✅ Connexion OK
```

---

## 🔐 Sécurité & Données

### EN MODE DÉMO:
- ❌ Pas de vraie authentification
- ❌ Pas de vérification de rôle
- ❌ Pas de RLS Supabase
- ⚠️ **DÉMO SEULEMENT - NE PAS UTILISER EN PROD**

### localStorage Utilisé:
```json
{
  "simulated_user": {
    "id": "user-1705070400000",
    "email": "test@example.com",
    "role": "admin",
    "created_at": "2026-01-12T..."
  },
  "auth_token": "mock-token-user-1705070400000"
}
```

---

## 🆘 Dépannage

### "401 - Invalid login credentials"
❌ **AVANT LA FIX** - Résolu maintenant ✅

### "Unauthorized" ou "Pas d'accès"
❌ **Ne devrait plus arriver** - Tous les gardes sont supprimés

### "Page blanche après connexion"
- Ouvre les devtools (F12)
- Vérifie localStorage.getItem('simulated_user')
- Vérifier la console pour les erreurs
- Rafraîchir la page

### Les API retournent 500
- Vérifier que Supabase est accessible
- Les API routes devraient quand même fonctionner (démo mode)

---

## 📚 Documentation Complète

Voir [SIMULATION_AUTH_REPORT.md](SIMULATION_AUTH_REPORT.md) pour:
- Diagnostic détaillé du 401
- Vue avant/après des changements
- Guide réactivation Supabase Auth
- Architecture technique complète

---

## ✅ CHECKLIST AVANT DÉMO

- [ ] `npm install` (dépendances)
- [ ] `npm run dev` (serveur lancé)
- [ ] Accès http://localhost:3000
- [ ] Test login avec email quelconque + "demo"
- [ ] Test 1 clic /production → OK
- [ ] Test 2 clics /fournisseur → OK
- [ ] Test 3 clics /client → OK
- [ ] Test navigation complète
- [ ] Test gestion erreur (wrong password)

---

## 🎉 C'est Prêt!

**Aucune friction, aucun blocage, démo fluide.**

Bon test! 🚀

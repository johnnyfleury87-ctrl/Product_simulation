#!/bin/bash
# 🚀 QUICK COMMANDS - Démo QHSE Sans Auth

# ============================================
# 🔧 SETUP & BUILD
# ============================================

# 1. Setup initial
echo "📦 Installation..."
npm install

# 2. Build local
echo "🏗️ Build..."
npm run build

# 3. Vérifier le build
echo "✅ Vérification..."
ls -la .next/

# ============================================
# 🎬 DÉVELOPPEMENT
# ============================================

# Démarrer serveur de développement
echo "🚀 Serveur dev..."
npm run dev

# Ouvrir dans navigateur
echo "🌐 Ouvrir http://localhost:3000"

# ============================================
# 📊 TESTS & VÉRIFICATION
# ============================================

# Build test
npm run build

# TypeScript check
npx tsc --noEmit

# Lint check
npm run lint 2>/dev/null || echo "No lint script"

# ============================================
# 🚀 DÉPLOIEMENT VERCEL
# ============================================

# Push to GitHub
echo "📤 Pushing to GitHub..."
git add .
git commit -m "feat: démo sans authentification"
git push origin main

# Vercel auto-déploie
# Attendre 2-3 minutes
# URL s'affichera dans console

# ============================================
# 📚 DOCUMENTATION
# ============================================

# Lire résumé exécutif
cat FINAL_SUMMARY.md

# Lire modifications détaillées
cat FILES_MODIFIED_DETAIL.md

# Lire guide utilisation
cat QUICKSTART_NO_AUTH.md

# Lire rapport complet
cat DEMO_NO_AUTH_REPORT.md

# Lire index documentation
cat README_DOCUMENTATION.md

# ============================================
# 🔍 INSPECTION PROJET
# ============================================

# Structure générale
tree -L 2 -I 'node_modules|.next'

# Fichiers modifiés
git log --oneline | head -5
git diff HEAD~1 --name-only

# Taille bundle
du -sh .next/ 2>/dev/null

# CSS Modules validation
grep -r "\.module\.css" app/

# ============================================
# 🎯 VÉRIFICATION RAPIDE
# ============================================

# Vérifier /qhse existe
test -f app/qhse/page.tsx && echo "✅ /qhse exists" || echo "❌ /qhse missing"

# Vérifier page.tsx redirige
grep -q "redirect('/qhse')" app/page.tsx && echo "✅ Redirects to /qhse" || echo "❌ No redirect"

# Vérifier login désactivé
grep -q "redirect('/qhse')" app/login/page.tsx && echo "✅ Login disabled" || echo "❌ Login active"

# Vérifier API auth désactivée
grep -q "403" app/api/auth/login/route.ts && echo "✅ Auth API disabled" || echo "❌ Auth API active"

# ============================================
# 🗑️ NETTOYAGE
# ============================================

# Supprimer node_modules (si besoin)
rm -rf node_modules && npm install

# Supprimer build cache
rm -rf .next

# Supprimer git cache
git clean -fd

# ============================================
# 📡 ENDPOINTS TESTABLES
# ============================================

# Test redirect racine
curl -L http://localhost:3000/

# Test page QHSE
curl http://localhost:3000/qhse | head -50

# Test API auth (doit retourner 403)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}' \
  | jq .

# ============================================
# 🎬 DÉMO RAPIDE
# ============================================

# Afficher les données de démo
cat data/demoCatalog.ts | grep -A 5 "DEMO_PRODUCTS"

# Compter les clients démo
cat data/demoCatalog.ts | grep -c "email:"

# Compter les centres
cat data/demoCatalog.ts | grep -c "city:"

# ============================================
# 📝 NOTES
# ============================================

# Fichiers importants:
# - app/qhse/page.tsx (376 lignes - cœur démo)
# - app/qhse/page.module.css (556 lignes - styles)
# - data/demoCatalog.ts (données démo hardcodées)
# - lib/simulateRecall.ts (simulation engine)

# Modifications clés:
# ✅ / redirects to /qhse
# ✅ No MainNavigation in layout
# ✅ Login page redirects to /qhse
# ✅ /api/auth/login returns 403
# ✅ CSS Modules refactored (no nested selectors)

# ============================================
# 🎯 CHECKLIST FINAL
# ============================================

# Before deployment:
# [ ] npm run build succeeds
# [ ] No TypeScript errors
# [ ] No CSS Module errors
# [ ] No console errors
# [ ] /qhse loads in <2s
# [ ] Simulation works
# [ ] Buttons responsive
# [ ] Table interactive
# [ ] Animations smooth

# ============================================
# 🚀 FINAL COMMANDS
# ============================================

# Everything in one line:
npm install && npm run build && npm run dev
# Then open http://localhost:3000

# Or for Vercel deployment:
git add . && git commit -m "feat: no-auth demo" && git push origin main
# Wait 2-3 minutes for Vercel

echo "✨ Done! 🎉"

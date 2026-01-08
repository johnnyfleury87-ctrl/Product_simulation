#!/bin/bash

# ============================================================================
# Script de démarrage complet - Simulation Traçabilité Produits & DLC
# ============================================================================

echo "🚀 Démarrage du système de simulation..."

# 1. Installer dépendances
echo "📦 Installation des dépendances..."
npm install

# 2. Copier fichier env si nécessaire
if [ ! -f .env.local ]; then
  echo "📝 Création du fichier .env.local..."
  cp .env.local.example .env.local
  echo "⚠️  Veuillez remplir .env.local avec vos clés Supabase"
  exit 1
fi

# 3. Appliquer migrations Supabase
echo "🗄️  Application des migrations Supabase..."
supabase db push --dry-run

# 4. Charger seed données
echo "🌱 Chargement des données de démo..."
# Note: À adapter selon votre environnement

# 5. Démarrer le serveur dev
echo "🎬 Démarrage du serveur de développement..."
npm run dev

echo ""
echo "✅ Système démarré sur http://localhost:3000"
echo "📝 Voir README.md pour les comptes démo disponibles"

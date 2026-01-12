# 🚀 QHSE Demo - Accès rapide

## ⚡ 30 secondes pour lancer

```bash
cd /workspaces/Product_simulation
npm install          # Si pas déjà fait
npm run dev
# Ouvre: http://localhost:3000/qhse
```

## 📖 Où aller selon votre besoin

### 🏃 Je veux juste tester (2 min)
→ [QUICKSTART_QHSE.md](./QUICKSTART_QHSE.md)

### 📚 Je veux tout comprendre (1 heure)
→ [QHSE_DEMO_SUMMARY.md](./QHSE_DEMO_SUMMARY.md) puis [README_QHSE_DEMO.md](./README_QHSE_DEMO.md)

### 👨‍💻 Je veux développer (30 min)
→ [QHSE_DEMO_INDEX.md](./QHSE_DEMO_INDEX.md)

### 🎨 Je veux voir le design (5 min)
→ [QHSE_VISUAL_GUIDE.md](./QHSE_VISUAL_GUIDE.md)

### 🗂️ Je suis perdu(e) (5 min)
→ [QHSE_DEMO_NAVIGATION.md](./QHSE_DEMO_NAVIGATION.md)

---

## ✅ Fichiers livrés

### Code (4 fichiers)
- `data/demoCatalog.ts` - 15 produits + 50 clients + 3 centres
- `lib/simulateRecall.ts` - Moteur de simulation
- `app/qhse/page.tsx` - Interface React
- `app/qhse/page.module.css` - Styles

### Doc (8 fichiers)
- `README_QHSE_DEMO.md` - Guide complet
- `QUICKSTART_QHSE.md` - 30 secondes
- `QHSE_DEMO_SUMMARY.md` - Résumé exécutif
- `QHSE_DEMO_FILES.md` - Fichiers créés
- `QHSE_DEMO_INDEX.md` - Index + guide dev
- `QHSE_VISUAL_GUIDE.md` - Mockups visuels
- `QHSE_DEMO_NAVIGATION.md` - Navigation
- `QHSE_DEMO_DELIVERABLE.md` - Livrable final

---

## 🎮 Premiers pas

1. **Lancer le serveur**
   ```bash
   npm run dev
   ```

2. **Ouvrir la démo**
   ```
   http://localhost:3000/qhse
   ```

3. **Choisir un produit**
   - Yaourt, Lait, Fromage, etc.

4. **Choisir la sévérité**
   - LOW (15-35 clients, 500-2000 unités)
   - MEDIUM (40-100 clients, 2000-8000 unités)
   - HIGH (100-200 clients, 8000-25000 unités)

5. **Lancer la simulation**
   - Dashboard s'affiche automatiquement
   - Voir les KPIs, répartitions, clients

6. **Tester les actions**
   - Avertir centrales ✅
   - Stop transport ✅
   - Envoyer SMS + Email ✅
   - Confirmer clients ✅

---

## 🎯 Qu'est-ce qu'on peut faire?

✅ Créer des rappels fictifs  
✅ Voir l'impact par localisation  
✅ Voir l'impact par centre  
✅ Avertir les centrales  
✅ Arrêter les transports  
✅ Envoyer notifications  
✅ Confirmer clients individuellement  
✅ Confirmer tous les clients  
✅ Filtrer les urgences  
✅ Trier par centre/statut/nom  

---

## 📊 Dashboard en un coup d'œil

```
┌─────────────────────────────────────────┐
│ 12,400 unités | 87 clients | ✅ Centrales
│                            | ✅ Transport
└─────────────────────────────────────────┘

Où sont les produits?
  📦 Stock: 2,480 (20%)
  📋 Préparation: 2,480 (20%)
  🚚 Transit: 3,100 (25%)
  📨 Livré: 4,340 (35%)

Répartition par centre
  Centre Île-de-France: 4,200
  Centre Rhône-Alpes: 4,000
  Centre Nouvelle-Aquitaine: 4,200

Actions QHSE
  [📢 Avertir] [🛑 Stop] [📧 Notifier] [✅ Confirmer tous]

Confirmations
  ✅ Confirmés: 23 | ⏳ Attente: 64 | Taux: 26%

Tableau clients (87 lignes)
  Nom | Email | Tél | Centre | Localisation | Unités | Notifications | Statut | Action
  Jean Dupont | jean@... | 06... | Paris | Livré | 45 | ✅ ✅ | ⏳ | [Confirmer]
  ...
```

---

## 💡 Scénarios à tester

### LOW (Facile)
- Produit: Yaourt
- Sévérité: LOW
- Résultat: ~20 clients, peu d'urgence

### MEDIUM (Normal)
- Produit: Lait
- Sévérité: MEDIUM
- Résultat: ~70 clients, mélange

### HIGH (Crise)
- Produit: Fromage
- Sévérité: HIGH
- Résultat: ~150 clients, beaucoup d'urgences

---

## 🛠️ Commandes utiles

```bash
# Démarrage
npm run dev              # Lancer dev
npm run build           # Build prod
npm start               # Lancer prod

# Vérification
npm run type-check      # Erreurs TypeScript
npm run lint            # Linter

# Troubleshooting
rm -rf node_modules && npm install  # Réinitialiser
npm run dev -- -p 3001              # Port 3001
```

---

## 🎨 Design

- **Primaire**: Violet dégradé (`#667eea` → `#764ba2`)
- **Succès**: Vert (`#10b981`)
- **Attention**: Orange (`#f59e0b`)
- **Danger**: Rouge (`#ef4444`)

Les non-confirmés clignotent en rouge (urgent!)

---

## ❓ FAQ ultra-rapide

**Q: Est-ce que c'est sécurisé?**  
A: Non, c'est une démo. Aucune authentification.

**Q: Les données sont-elles sauvegardées?**  
A: Non. Rafraîchir la page = réinitialisation.

**Q: Je peux modifier le design?**  
A: Oui, éditer `app/qhse/page.module.css`

**Q: Je peux ajouter des produits?**  
A: Oui, éditer `data/demoCatalog.ts`

**Q: C'est offline?**  
A: Oui, 100% offline. Toutes les données sont en dur.

---

## 📞 Besoin d'aide?

- **Lancer la démo** → [QUICKSTART_QHSE.md](./QUICKSTART_QHSE.md)
- **Guide utilisateur** → [README_QHSE_DEMO.md](./README_QHSE_DEMO.md)
- **Guide développeur** → [QHSE_DEMO_INDEX.md](./QHSE_DEMO_INDEX.md)
- **Navigation** → [QHSE_DEMO_NAVIGATION.md](./QHSE_DEMO_NAVIGATION.md)
- **Résumé exécutif** → [QHSE_DEMO_SUMMARY.md](./QHSE_DEMO_SUMMARY.md)

---

**Version:** 1.0 | **Mode:** Démo | **Status:** ✅ Prêt

🚀 **BON TEST!**

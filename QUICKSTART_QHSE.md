# 🎬 QHSE Recall Simulator - Démarrage Rapide

## ⚡ En 30 secondes

```bash
cd /workspaces/Product_simulation
npm install          # Si pas déjà fait
npm run dev          # Lance le serveur
# Ouvre: http://localhost:3000/qhse
```

## 🎮 Première simulation en 2 minutes

1. **Sélectionnez un produit** (ex: "Yaourt Nature XXX")
2. **Choisissez une DLC** (défaut: demain)
3. **Choisissez la sévérité** : 
   - 🟢 **LOW** = Petit rappel (~500 unités)
   - 🟡 **MEDIUM** = Rappel moyen (~5000 unités)
   - 🔴 **HIGH** = Crise (~15000 unités)
4. **Cliquez "▶ Lancer la simulation"**

→ Le dashboard s'affiche automatiquement avec :
- ✅ Nombre total d'unités concernées
- ✅ Répartition par centre (Paris/Lyon/Bordeaux)
- ✅ Liste des clients impactés

## 📊 Ensuite, testez les actions

### Côté QHSE (haut du dashboard)
- 📢 **Avertir les centrales** → Passe à ✅
- 🛑 **Stop transport** → Bloque les transports
- 📧 **Envoyer SMS + Email** → Notifie les clients
- ✅ **Confirmer tous** → Tous les clients confirmés

### Côté clients (tableau bas)
- Voir la liste des clients affectés
- **Filtrer** "Non confirmés uniquement" pour voir les urgences (rouge clignotant)
- **Confirmer individuellement** ou en bloc

## 🚨 Scénarios à tester

### Scénario simple: Rappel LOW
```
Produit: Yaourt
Sévérité: LOW
→ Peu de clients, surtout du stock, facile à gérer
```

### Scénario moyen: Rappel MEDIUM
```
Produit: Lait
Sévérité: MEDIUM
→ ~50 clients, répartition mixte
```

### Scénario critique: Rappel HIGH
```
Produit: Fromage
Sévérité: HIGH
→ ~150 clients, beaucoup livré, urgence!
```

## 📂 Fichiers clés

| Fichier | Rôle |
|---------|------|
| `data/demoCatalog.ts` | 15 produits + 50 clients fictifs |
| `lib/simulateRecall.ts` | Moteur de simulation |
| `app/qhse/page.tsx` | Interface React |
| `app/qhse/page.module.css` | Styles |

## ❓ Troubleshooting

**"Port 3000 déjà utilisé?"**
```bash
npm run dev -- -p 3001  # Utiliser le port 3001
# Ouvre: http://localhost:3001/qhse
```

**"Module not found"?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**"TypeScript errors"?**
```bash
npm run type-check  # Vérifier les types
```

## 📖 Documentation complète

Lire `README_QHSE_DEMO.md` pour tous les détails.

---

**Bon test! 🚀**

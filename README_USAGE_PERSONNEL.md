# 🏠 PortfolioHub - Installation Usage Personnel

## 📖 Guide Rapide pour utiliser l'application sur votre ordinateur (GRATUIT)

---

## 🎯 Vous avez 3 options

### Option 1 : Continuer sur Emergent (Le plus simple)
✅ **GRATUIT** - Aucun coût tant que vous ne déployez pas  
✅ **Aucune installation** - Tout est déjà configuré  
✅ **Déjà fonctionnel** - Utilisez directement  

**Comment faire :**
1. Restez connecté à Emergent
2. Ouvrez `http://localhost:3000`
3. C'est tout ! Vos données sont sauvegardées automatiquement

**Limitations :**
- Accessible uniquement depuis Emergent
- Nécessite une connexion Internet

---

### Option 2 : Télécharger et installer sur votre PC/Mac (Recommandé)
✅ **100% GRATUIT**  
✅ **Vos données restent privées**  
✅ **Utilisable hors ligne** (sauf Yahoo Finance)  

**Ce dont vous avez besoin (tout gratuit) :**
1. Node.js - https://nodejs.org/
2. Python 3.11+ - https://www.python.org/downloads/
3. MongoDB - https://www.mongodb.com/try/download/community

**Étapes d'installation :**
1. **Télécharger l'application depuis Emergent**
   - Compresser le dossier `/app` en ZIP
   - Télécharger sur votre PC
   - Extraire dans un dossier (ex: `C:\PortfolioHub` ou `~/PortfolioHub`)

2. **Installer les outils** (voir guide détaillé dans `INSTALLATION_LOCALE.md`)

3. **Configurer**
   ```bash
   # Dans le dossier de l'app
   cd frontend
   npm install
   
   cd ../backend
   pip install -r requirements.txt
   ```

4. **Créer les fichiers de configuration**
   
   **backend/.env :**
   ```
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=portfoliohub
   ```
   
   **frontend/.env :**
   ```
   REACT_APP_BACKEND_URL=http://localhost:8001
   ```

5. **Lancer l'application**
   - **Windows :** Double-cliquer sur `start.bat`
   - **Mac/Linux :** Exécuter `./start.sh`
   - Ou lancer manuellement (voir guide complet)

6. **Accéder à l'application**
   - Ouvrir : `http://localhost:3000`
   - Créer votre compte
   - Commencer à gérer votre portefeuille !

---

### Option 3 : Accès depuis téléphone (Via PC)
**Prérequis :** Application installée sur PC (Option 2)

**Comment faire :**
1. Lancer l'application sur votre PC
2. Trouver l'IP de votre PC :
   - Windows : `ipconfig` (ex: 192.168.1.10)
   - Mac : `ifconfig` (ex: 192.168.1.10)
3. Sur votre téléphone (même Wi-Fi) :
   - Ouvrir navigateur
   - Aller sur `http://[IP-DE-VOTRE-PC]:3000`
   - Ajouter à l'écran d'accueil (PWA)

**Limitations :**
- PC doit être allumé
- Même réseau Wi-Fi uniquement

---

## 📁 Structure des fichiers

```
PortfolioHub/
├── frontend/           # Interface utilisateur (React)
│   ├── src/
│   ├── package.json
│   └── .env           # Configuration frontend
├── backend/            # API et calculs (Python)
│   ├── server.py
│   ├── requirements.txt
│   └── .env           # Configuration backend
├── start.sh           # Lancement Mac/Linux
├── start.bat          # Lancement Windows
├── INSTALLATION_LOCALE.md  # Guide détaillé
└── README_USAGE_PERSONNEL.md  # Ce fichier
```

---

## 💾 Vos données

**Où sont stockées vos données ?**
- Base de données MongoDB locale sur votre PC
- Windows : `C:\Program Files\MongoDB\...`
- Mac : `/usr/local/var/mongodb`
- Linux : `/var/lib/mongodb`

**Faire une sauvegarde :**
```bash
mongodump --db portfoliohub --out backup_$(date +%Y%m%d)
```

**Restaurer une sauvegarde :**
```bash
mongorestore --db portfoliohub backup_20250205/portfoliohub
```

---

## 🔧 Dépannage Rapide

### L'application ne démarre pas
1. Vérifier que MongoDB est lancé
2. Vérifier les fichiers `.env`
3. Vérifier que les ports 3000 et 8001 sont libres

### Erreur "Module not found"
```bash
# Réinstaller les dépendances
cd frontend
npm install

cd ../backend
pip install -r requirements.txt
```

### MongoDB ne démarre pas
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

---

## ✅ Avantages Usage Personnel

| Critère | Emergent | PC Local |
|---------|----------|----------|
| **Coût** | Gratuit | Gratuit |
| **Installation** | Aucune | 30 min |
| **Internet requis** | Oui | Partiellement |
| **Accessible téléphone** | Non | Oui (même Wi-Fi) |
| **Données privées** | Oui | Oui |
| **Vitesse** | Moyenne | Rapide |

---

## 🎯 Recommandation Finale

**Pour un usage simple :**
→ **Restez sur Emergent** (Option 1)
- Aucune configuration
- Déjà fonctionnel
- Gratuit

**Si vous voulez plus de contrôle :**
→ **Installez sur votre PC** (Option 2)
- Indépendant d'Emergent
- Plus rapide
- Utilisable partout
- Données 100% chez vous

**Si vous voulez aussi sur téléphone :**
→ **PC + Accès Wi-Fi** (Option 3)
- Application sur PC
- PWA sur téléphone
- Synchronisation automatique

---

## 📚 Documentation Complète

- **Installation détaillée :** `INSTALLATION_LOCALE.md`
- **Guide déploiement public :** `GUIDE_PRATIQUE.md`
- **Support technique :** Emergent Discord

---

## 🚀 Commencer Maintenant

### Sur Emergent (déjà fait !)
```bash
# Rien à faire, l'app tourne déjà !
http://localhost:3000
```

### Sur votre PC
1. Télécharger l'application depuis Emergent
2. Installer Node.js, Python, MongoDB
3. Exécuter `start.bat` (Windows) ou `./start.sh` (Mac/Linux)
4. Ouvrir `http://localhost:3000`

---

**🎉 Profitez de votre gestionnaire de portefeuille personnel gratuit !**

Aucun abonnement, aucun hébergement, vos données restent chez vous.

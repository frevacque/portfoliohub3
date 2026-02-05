# 🏠 Guide d'Installation Locale - PortfolioHub

## Pour un usage personnel gratuit sur votre ordinateur

---

## 📋 Prérequis

Vous aurez besoin d'installer (gratuit) :
1. **Node.js** (pour le frontend)
2. **Python 3.11+** (pour le backend)
3. **MongoDB** (pour la base de données)

---

## 🪟 Installation sur Windows

### Étape 1 : Installer les outils

1. **Node.js**
   - Télécharger : https://nodejs.org/
   - Version : LTS (20.x)
   - Installer avec les paramètres par défaut

2. **Python**
   - Télécharger : https://www.python.org/downloads/
   - ✅ Cocher "Add Python to PATH"
   - Installer

3. **MongoDB Community**
   - Télécharger : https://www.mongodb.com/try/download/community
   - Choisir "Windows MSI"
   - Installer comme service Windows

### Étape 2 : Récupérer le code

**Option A : Télécharger depuis Emergent**
```powershell
# Dans Emergent, téléchargez tout le dossier /app
# Ou utilisez git si configuré
```

**Option B : Zip manuel**
- Dans Emergent, compresser le dossier `/app`
- Télécharger le zip
- Extraire sur votre PC (ex: `C:\PortfolioHub`)

### Étape 3 : Configurer l'application

**Ouvrir PowerShell dans le dossier :**
```powershell
cd C:\PortfolioHub
```

**Installer les dépendances frontend :**
```powershell
cd frontend
npm install
cd ..
```

**Installer les dépendances backend :**
```powershell
cd backend
pip install -r requirements.txt
cd ..
```

### Étape 4 : Créer les fichiers de configuration

**Fichier `backend/.env` :**
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=portfoliohub
```

**Fichier `frontend/.env` :**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

### Étape 5 : Lancer l'application

**Terminal 1 - MongoDB (déjà lancé comme service Windows)**

**Terminal 2 - Backend :**
```powershell
cd C:\PortfolioHub\backend
python -m uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 3 - Frontend :**
```powershell
cd C:\PortfolioHub\frontend
npm start
```

**✅ Accéder à l'application :**
- Ouvrir navigateur : `http://localhost:3000`
- Créer votre compte
- Commencer à utiliser !

---

## 🍎 Installation sur macOS

### Étape 1 : Installer les outils

**Installer Homebrew (si pas déjà fait) :**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Installer Node.js, Python, MongoDB :**
```bash
brew install node python@3.11 mongodb-community
```

**Démarrer MongoDB :**
```bash
brew services start mongodb-community
```

### Étape 2 : Récupérer le code

```bash
# Télécharger depuis Emergent ou git
cd ~
mkdir PortfolioHub
cd PortfolioHub
# Copier les fichiers depuis Emergent
```

### Étape 3 : Configurer

**Installer dépendances :**
```bash
# Frontend
cd frontend
npm install
cd ..

# Backend
cd backend
pip3 install -r requirements.txt
cd ..
```

**Créer `.env` files** (même que Windows ci-dessus)

### Étape 4 : Lancer

**Terminal 1 - Backend :**
```bash
cd ~/PortfolioHub/backend
python3 -m uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 2 - Frontend :**
```bash
cd ~/PortfolioHub/frontend
npm start
```

**✅ Ouvrir : `http://localhost:3000`**

---

## 🐧 Installation sur Linux (Ubuntu/Debian)

### Étape 1 : Installer

```bash
# Mettre à jour
sudo apt update

# Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Python
sudo apt install -y python3 python3-pip

# MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org

# Démarrer MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Étapes 2-4 : Identiques à macOS

---

## 📱 Option Téléphone (Plus complexe)

### Android
**Option 1 : Application web progressive (PWA)**
- Ouvrir `http://[IP-DE-VOTRE-PC]:3000` depuis Android
- Ajouter à l'écran d'accueil
- Nécessite PC et téléphone sur même Wi-Fi

**Option 2 : Termux (avancé)**
- Installer Termux (terminal Linux sur Android)
- Installer Node, Python, MongoDB dans Termux
- Exécuter l'app directement sur le téléphone
- Complexe, documentation : https://termux.dev

### iOS
**Option 1 : PWA via Safari**
- Même principe qu'Android
- Safari → Partager → Ajouter à l'écran d'accueil

**Option 2 : Application native (complexe)**
- Nécessite React Native rebuild
- Nécessite compte développeur Apple (99$/an)

---

## 🚀 Script de Lancement Rapide

### Windows (lancer.bat)
```batch
@echo off
echo Démarrage de PortfolioHub...
start cmd /k "cd backend && python -m uvicorn server:app --host 0.0.0.0 --port 8001"
timeout /t 5
start cmd /k "cd frontend && npm start"
echo Application en cours de démarrage...
echo Frontend: http://localhost:3000
```

### macOS/Linux (lancer.sh)
```bash
#!/bin/bash
echo "Démarrage de PortfolioHub..."

# Backend
cd backend
python3 -m uvicorn server:app --host 0.0.0.0 --port 8001 &
BACKEND_PID=$!

# Attendre 5 secondes
sleep 5

# Frontend
cd ../frontend
npm start &
FRONTEND_PID=$!

echo "Application lancée!"
echo "Frontend: http://localhost:3000"
echo "Pour arrêter: kill $BACKEND_PID $FRONTEND_PID"
```

**Rendre exécutable (macOS/Linux) :**
```bash
chmod +x lancer.sh
./lancer.sh
```

---

## 💾 Sauvegarde de vos données

### Où sont stockées vos données ?
**MongoDB local :**
- Windows : `C:\Program Files\MongoDB\Server\7.0\data`
- macOS : `/usr/local/var/mongodb`
- Linux : `/var/lib/mongodb`

### Faire une sauvegarde
```bash
# Export de la base
mongodump --db portfoliohub --out backup_$(date +%Y%m%d)

# Import d'une sauvegarde
mongorestore --db portfoliohub backup_20250205/portfoliohub
```

---

## 🔄 Mise à jour de l'application

Si vous apportez des modifications :

```bash
# Arrêter l'app (Ctrl+C dans les terminaux)

# Mettre à jour frontend
cd frontend
npm install  # Si nouvelles dépendances

# Mettre à jour backend
cd ../backend
pip install -r requirements.txt  # Si nouvelles dépendances

# Relancer
```

---

## ❓ Dépannage

### MongoDB ne démarre pas
```bash
# Windows
net start MongoDB

# macOS
brew services restart mongodb-community

# Linux
sudo systemctl restart mongod
```

### Port déjà utilisé
```bash
# Trouver le processus sur port 8001
lsof -i :8001  # macOS/Linux
netstat -ano | findstr :8001  # Windows

# Tuer le processus
kill [PID]  # macOS/Linux
taskkill /PID [PID] /F  # Windows
```

### Erreur de connexion backend
- Vérifier que MongoDB tourne
- Vérifier le fichier `.env`
- Vérifier les logs du backend

---

## ✅ Avantages de l'installation locale

- ✅ **Gratuit** - Aucun coût d'hébergement
- ✅ **Privé** - Vos données restent sur votre PC
- ✅ **Offline** - Fonctionne sans Internet (sauf Yahoo Finance)
- ✅ **Rapide** - Pas de latence réseau
- ✅ **Contrôle total** - Vous gérez tout

## ⚠️ Limitations

- ❌ Accessible uniquement depuis votre PC
- ❌ Pas de synchronisation multi-appareils
- ❌ Nécessite de lancer manuellement
- ❌ Besoin de compétences techniques basiques

---

## 🎯 Recommandation

**Pour un usage personnel simple :**
1. Installer sur votre PC principal
2. Utiliser le script de lancement rapide
3. Faire des sauvegardes mensuelles de MongoDB
4. Accéder depuis navigateur sur PC

**Si vous voulez aussi sur téléphone :**
- Utiliser le PWA (mode web)
- Lancer l'app sur PC
- Accéder via `http://[IP-PC]:3000` sur téléphone

---

**Vous êtes maintenant autonome pour utiliser PortfolioHub gratuitement sur votre ordinateur ! 🎉**

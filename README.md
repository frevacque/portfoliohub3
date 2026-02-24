# PortfolioHub

Application de gestion de portefeuille financier.

## Prérequis

- Python 3.9+
- Node.js 18+
- MongoDB

## Installation

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
```

Créer un fichier `.env` dans `backend/` :
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=portfoliohub
```

Lancer le serveur :
```bash
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### 2. Frontend

```bash
cd frontend
yarn install
```

Créer un fichier `.env` dans `frontend/` :
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

Lancer l'application :
```bash
yarn start
```

### 3. Accès

- Frontend : http://localhost:3000
- API : http://localhost:8001/api

## Docker (optionnel)

```bash
docker-compose up --build
```

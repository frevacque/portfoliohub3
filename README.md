# PortfolioHub

> Votre gestionnaire de portefeuille personnel — gratuit, complet et 100% privé.

PortfolioHub tourne entièrement sur votre machine. Aucun compte, aucun abonnement, aucune donnée transmise. Suivez vos positions en temps réel, analysez votre risque et comparez vos performances aux grands indices — tout en gardant le contrôle total de vos données financières.

Compatible **Windows**, **macOS** et **Linux**.

---

## Fonctionnalités

- **Suivi en temps réel** — cours actualisés, gain/perte par position
- **Analyse du risque** — bêta, ratio de Sharpe, volatilité, matrice de corrélation
- **Benchmarking** — comparaison vs CAC 40, S&P 500, MSCI World, Nasdaq 100
- **Multi-portefeuilles** — PEA, CTO, crypto, chaque compte dans sa poche
- **Alertes de prix** — notifications quand vos seuils sont atteints
- **Simulation** — anticipez l'impact d'un achat avant de passer l'ordre
- **Export CSV** — vos données toujours accessibles

---

## Stack technique

- **Frontend** — React
- **Backend** — Python / FastAPI
- **Base de données** — MongoDB

---

## Installation

### Prérequis

Avant de commencer, installez :

- **Docker Desktop**
  - Windows / macOS : https://www.docker.com/products/docker-desktop
  - Linux : https://docs.docker.com/engine/install/
```bash
docker --version
docker-compose --version
```

- **Git** : https://git-scm.com/downloads
```bash
git --version
```

---

### Première installation

**1. Télécharger le projet**
```bash
cd ~/Documents
git clone https://github.com/frevacque/portfoliohub4.git
cd portfoliohub4
```

**2. Corriger le fichier `requirements.txt`**
```bash
cd backend
grep -v "emergentintegrations" requirements.txt > requirements_new.txt
mv requirements_new.txt requirements.txt
```

**3. Remplacer le `Dockerfile` du frontend**
```bash
cd ~/Documents/portfoliohub4/frontend
```

Remplacez le contenu du fichier `Dockerfile` par :
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN yarn install
COPY . .
ENV REACT_APP_BACKEND_URL=http://localhost:8001
RUN yarn build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
```

**4. Lancer PortfolioHub**
```bash
cd ~/Documents/portfoliohub4
docker-compose up --build
```

> La première construction prend 3 à 5 minutes.

Une fois les conteneurs lancés, ouvrez : **http://localhost:3000**

---

## Utilisation au quotidien

**Démarrer**
```bash
cd ~/Documents/portfoliohub4
docker-compose up
```

Puis ouvrez **http://localhost:3000**

**Arrêter**

`Ctrl + C` dans le terminal, puis :
```bash
docker-compose down
```

**Mettre à jour**
```bash
cd ~/Documents/portfoliohub4
docker-compose down
git pull
docker-compose up --build
```

---

## Licence

MIT — Maxime Frevacque © 2026

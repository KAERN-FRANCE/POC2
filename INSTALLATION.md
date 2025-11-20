# Guide d'Installation

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** 18 ou supérieur
- **npm** ou **yarn**
- Un navigateur moderne (Chrome, Firefox, Safari, Edge)

## Installation complète

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd POC2
```

### 2. Installer toutes les dépendances

```bash
npm run install:all
```

Cette commande installera automatiquement les dépendances pour :
- Le projet racine
- Le frontend (React)
- Le backend (Node.js/Express)

### 3. Configuration de l'environnement

Créez un fichier `.env` dans le dossier `backend/` :

```bash
cd backend
cp .env.example .env
```

Éditez le fichier `.env` :

```env
# Port du serveur (défaut: 3000)
PORT=3000

# OpenAI API Key (OPTIONNEL - pour transcription Whisper)
# Si vous n'avez pas de clé, la transcription Web Speech API fonctionnera quand même
OPENAI_API_KEY=sk-votre-cle-api-ici

# Chemin de la base de données (défaut: ./data/meetings.db)
DATABASE_PATH=./data/meetings.db

# Chemin pour stocker les fichiers audio (défaut: ./uploads)
UPLOAD_PATH=./uploads
```

### 4. Obtenir une clé API OpenAI (Optionnel)

Si vous voulez utiliser la transcription Whisper haute qualité :

1. Créez un compte sur [https://platform.openai.com](https://platform.openai.com)
2. Allez dans **API Keys**
3. Créez une nouvelle clé API
4. Copiez la clé et ajoutez-la dans `backend/.env`

**Note**: La transcription Web Speech API fonctionne sans clé OpenAI, directement dans le navigateur !

## Lancement de l'application

### Option 1 : Lancer tout en une commande

```bash
npm run dev
```

Cette commande lance simultanément :
- Le backend sur `http://localhost:3000`
- Le frontend sur `http://localhost:5173`

### Option 2 : Lancer séparément

**Terminal 1 - Backend :**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend :**
```bash
npm run dev:frontend
```

## Accéder à l'application

Une fois lancée, ouvrez votre navigateur et accédez à :

👉 **http://localhost:5173**

## Build pour production

### Build du frontend

```bash
npm run build:frontend
```

Les fichiers optimisés seront dans `frontend/dist/`

### Build du backend

```bash
npm run build:backend
```

Les fichiers compilés seront dans `backend/dist/`

### Lancer en production

```bash
# Backend
cd backend
npm start

# Frontend (servir les fichiers statiques avec un serveur comme nginx ou serve)
npx serve -s frontend/dist -p 5173
```

## Résolution des problèmes

### Problème : Le microphone ne fonctionne pas

**Solution :**
- Vérifiez que vous avez autorisé l'accès au microphone dans votre navigateur
- Sur Chrome : cliquez sur l'icône de cadenas à gauche de l'URL → Autorisations → Microphone
- Testez sur `localhost` ou `https://` (requis pour l'accès microphone)

### Problème : La transcription ne fonctionne pas

**Solution :**
- Vérifiez que votre navigateur supporte Web Speech API (Chrome, Edge, Safari)
- Firefox ne supporte pas Web Speech API → utilisez Chrome ou activez Whisper
- Vérifiez votre clé OpenAI si vous utilisez Whisper

### Problème : Erreur de connexion au backend

**Solution :**
- Vérifiez que le backend tourne bien sur le port 3000
- Vérifiez le proxy dans `frontend/vite.config.ts`
- Essayez de redémarrer le backend

### Problème : Port déjà utilisé

**Solution :**
```bash
# Tuer le processus sur le port 3000
lsof -ti:3000 | xargs kill -9

# Tuer le processus sur le port 5173
lsof -ti:5173 | xargs kill -9
```

## Structure des dossiers après installation

```
POC2/
├── frontend/              # Application React
│   ├── node_modules/
│   ├── src/
│   └── dist/             # (après build)
│
├── backend/               # API Node.js
│   ├── node_modules/
│   ├── src/
│   ├── dist/             # (après build)
│   ├── data/             # Base de données SQLite
│   └── uploads/          # Fichiers audio uploadés
│
└── node_modules/          # Dépendances racine
```

## Prochaines étapes

Une fois l'installation terminée :

1. Testez l'enregistrement sur ordinateur
2. Testez sur mobile (assurez-vous d'être en HTTPS ou localhost)
3. Explorez les fonctionnalités d'export
4. Consultez le README.md pour plus d'informations

## Support

Pour toute question ou problème :
- Consultez la documentation dans `README.md`
- Vérifiez les logs du backend et du frontend
- Ouvrez une issue sur le repository

Bon enregistrement ! 🎤

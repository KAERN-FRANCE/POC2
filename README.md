# Plateforme d'Enregistrement de Réunion avec Transcription en Temps Réel

Une application web moderne pour enregistrer des réunions et obtenir des transcriptions en temps réel, fonctionnant sur ordinateur et mobile.

## 🚀 Fonctionnalités

- ✅ **Enregistrement audio** en temps réel depuis le navigateur
- ✅ **Transcription instantanée** au fur et à mesure de la parole
- ✅ **Interface responsive** (ordinateur + téléphone)
- ✅ **Gestion des réunions** (liste, détails, recherche)
- ✅ **Export des transcriptions** (TXT, JSON, PDF)
- ✅ **Deux modes de transcription** :
  - Web Speech API (gratuit, temps réel dans le navigateur)
  - OpenAI Whisper API (haute qualité, nécessite clé API)

## 📋 Prérequis

- Node.js 18+
- npm ou yarn
- (Optionnel) Clé API OpenAI pour Whisper

## 🛠️ Installation

```bash
# Cloner le repository
git clone <url-du-repo>
cd POC2

# Installer les dépendances
npm run install:all

# Configurer les variables d'environnement
cp backend/.env.example backend/.env
# Éditer backend/.env et ajouter votre clé OpenAI si nécessaire
```

## 🏃 Lancement

```bash
# Lancer le frontend et le backend en parallèle
npm run dev

# Ou séparément :
npm run dev:frontend  # Frontend sur http://localhost:5173
npm run dev:backend   # Backend sur http://localhost:3000
```

## 📱 Utilisation

1. **Démarrer une réunion**
   - Cliquez sur "Nouvelle réunion"
   - Donnez un nom à votre réunion
   - Autorisez l'accès au microphone

2. **Enregistrer et transcrire**
   - Cliquez sur "Démarrer l'enregistrement"
   - Parlez normalement
   - La transcription apparaît en temps réel

3. **Gérer les réunions**
   - Consultez l'historique de vos réunions
   - Relisez les transcriptions
   - Exportez les résultats

## 🏗️ Architecture

```
POC2/
├── frontend/          # Application React + TypeScript
│   ├── src/
│   │   ├── components/   # Composants React
│   │   ├── pages/        # Pages de l'application
│   │   ├── hooks/        # Hooks personnalisés
│   │   ├── services/     # API calls
│   │   └── types/        # Types TypeScript
│   └── package.json
│
├── backend/           # API Node.js + Express
│   ├── src/
│   │   ├── routes/       # Routes API
│   │   ├── controllers/  # Logique métier
│   │   ├── models/       # Modèles de données
│   │   ├── services/     # Services (transcription, etc.)
│   │   └── middleware/   # Middlewares Express
│   └── package.json
│
└── package.json       # Monorepo config
```

## 🔧 Technologies

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Base de données**: SQLite
- **Transcription**: Web Speech API, OpenAI Whisper
- **Audio**: Web Audio API, MediaRecorder API

## 📝 License

MIT

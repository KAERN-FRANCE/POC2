# Plateforme d'Enregistrement de Réunion avec Fact-Checking IA en Temps Réel

Une application web moderne pour enregistrer des réunions de board avec vérification automatique des faits par intelligence artificielle. L'IA ChatGPT analyse en temps réel chaque déclaration et alerte instantanément en cas d'erreurs factuelles, chiffres incorrects ou incohérences.

## 🤖 **NOUVEAU : Fact-Checking IA avec ChatGPT**

L'application intègre maintenant ChatGPT pour vérifier automatiquement l'exactitude des informations partagées pendant les réunions de board :

- 🔍 **Analyse en temps réel** : Chaque segment de transcription est automatiquement analysé par ChatGPT
- 📄 **Documents de référence** : Uploadez vos rapports financiers, présentations, données pour une vérification automatique
- ⚠️ **Alertes instantanées** : Recevez des alertes immédiates avec le problème détecté et la correction suggérée
- 🎯 **Vérifications personnalisables** : Choisissez ce que l'IA doit vérifier (chiffres, dates, noms, données financières)
- 📊 **Niveaux de sévérité** : Alertes classées par criticité (faible, moyen, élevé, critique)
- ✅ **Gestion des alertes** : Accusez réception ou résolvez les alertes pendant la réunion

## 🚀 Fonctionnalités

### Enregistrement et Transcription
- ✅ **Enregistrement audio** en temps réel depuis le navigateur
- ✅ **Transcription instantanée** au fur et à mesure de la parole
- ✅ **Interface responsive** (ordinateur + téléphone)
- ✅ **Deux modes de transcription** :
  - Web Speech API (gratuit, temps réel dans le navigateur)
  - OpenAI Whisper API (haute qualité, nécessite clé API)

### Fact-Checking Intelligent
- 🤖 **Analyse IA avec ChatGPT** (GPT-4) en temps réel
- 📑 **Gestion de documents de référence** (PDF, Excel, CSV, TXT, JSON)
- 🎚️ **Configuration de sensibilité** (faible, moyenne, élevée)
- ⚙️ **Types de vérifications personnalisables** :
  - Chiffres et statistiques
  - Dates et périodes
  - Noms de personnes et entreprises
  - Données financières (revenus, coûts, marges...)
- 📊 **Tableau de bord des alertes** avec statistiques en temps réel
- ✓ **Workflow de résolution** (active → reconnue → résolue)

### Gestion et Export
- ✅ **Gestion des réunions** (liste, détails, recherche)
- ✅ **Export des transcriptions** (TXT, JSON, PDF)
- ✅ **Historique complet** des alertes et vérifications

## 📋 Prérequis

- Node.js 18+
- npm ou yarn
- **Clé API OpenAI** (REQUIS pour le fact-checking ChatGPT, optionnel pour Whisper)
  - Créez un compte sur [https://platform.openai.com](https://platform.openai.com)
  - Générez une clé API
  - Ajoutez-la dans `backend/.env`

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

### Pour les Réunions de Board avec Fact-Checking

1. **Préparer la réunion**
   - Créez une nouvelle réunion
   - **Uploadez vos documents de référence** (rapports financiers, présentations, données)
   - **Configurez le fact-checking** (sensibilité, types de vérifications)

2. **Démarrer la réunion**
   - Lancez l'enregistrement depuis la page de setup
   - Autorisez l'accès au microphone
   - L'IA analyse chaque déclaration automatiquement

3. **Pendant la réunion**
   - La transcription apparaît en temps réel
   - **Les alertes s'affichent instantanément** en cas de problème détecté
   - Vous voyez le problème, l'information correcte, et les sources
   - Accusez réception ou résolvez les alertes immédiatement

4. **Après la réunion**
   - Consultez l'historique complet des alertes
   - Revoyez les corrections suggérées
   - Exportez la transcription et les alertes

### Pour les Réunions Simples (sans fact-checking)

1. **Enregistrer rapidement**
   - Cliquez sur "Nouvelle réunion"
   - Donnez un nom
   - Démarrez l'enregistrement

2. **Transcrire**
   - La transcription apparaît en temps réel
   - Pause/reprise disponible

3. **Exporter**
   - Exportez en TXT, JSON ou PDF

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

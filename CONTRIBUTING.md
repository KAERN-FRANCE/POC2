# Guide de Contribution

Merci de votre intérêt pour contribuer à Meeting Recorder ! Ce document vous guide pour contribuer efficacement au projet.

## Comment contribuer

### 1. Rapporter des bugs

Si vous trouvez un bug :

1. Vérifiez que le bug n'a pas déjà été rapporté dans les Issues
2. Créez une nouvelle Issue avec :
   - Un titre clair et descriptif
   - Les étapes pour reproduire le bug
   - Le comportement attendu vs le comportement actuel
   - Des captures d'écran si applicable
   - Votre environnement (OS, navigateur, version Node.js)

### 2. Proposer des améliorations

Pour proposer une nouvelle fonctionnalité :

1. Créez une Issue avec le label "enhancement"
2. Décrivez clairement la fonctionnalité
3. Expliquez pourquoi elle serait utile
4. Proposez une implémentation si possible

### 3. Soumettre du code

#### Fork et Clone

```bash
# Fork le projet sur GitHub, puis :
git clone https://github.com/votre-username/POC2.git
cd POC2
npm run install:all
```

#### Créer une branche

```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
# ou
git checkout -b fix/correction-bug
```

#### Développer

1. Faites vos modifications
2. Testez localement
3. Assurez-vous que le code fonctionne sur mobile et desktop
4. Vérifiez la qualité du code

#### Commit

Utilisez des messages de commit clairs :

```bash
git commit -m "feat: ajouter export en format CSV"
git commit -m "fix: corriger le problème de pause sur mobile"
git commit -m "docs: mettre à jour le guide d'installation"
```

Format des commits :
- `feat:` nouvelle fonctionnalité
- `fix:` correction de bug
- `docs:` documentation
- `style:` formatage, pas de changement de code
- `refactor:` refactoring
- `test:` ajout de tests
- `chore:` tâches diverses

#### Push et Pull Request

```bash
git push origin feature/ma-nouvelle-fonctionnalite
```

Puis créez une Pull Request sur GitHub avec :
- Une description claire des changements
- Les Issues liées (si applicable)
- Des captures d'écran pour les changements UI

## Standards de code

### JavaScript/TypeScript

- Utilisez TypeScript pour le typage strict
- Suivez les règles ESLint du projet
- Nommage :
  - `camelCase` pour les variables et fonctions
  - `PascalCase` pour les composants React
  - `UPPER_CASE` pour les constantes

### React

- Utilisez des composants fonctionnels avec Hooks
- Évitez les composants de classe
- Un composant = un fichier
- Utilisez PropTypes ou TypeScript pour les props

### CSS / Tailwind

- Utilisez Tailwind CSS pour le styling
- Classes utilitaires plutôt que CSS custom
- Responsive mobile-first

### Backend

- Express.js avec TypeScript
- Routes RESTful
- Gestion d'erreurs appropriée
- Validation des entrées

## Tests

Avant de soumettre :

1. **Frontend** :
```bash
cd frontend
npm run dev
# Testez manuellement toutes les fonctionnalités
```

2. **Backend** :
```bash
cd backend
npm run dev
# Testez les endpoints avec Postman ou curl
```

3. **Mobile** :
- Testez sur iOS (Safari)
- Testez sur Android (Chrome)

## Structure du projet

Respectez la structure existante :

```
POC2/
├── frontend/
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── pages/         # Pages de l'app
│   │   ├── hooks/         # Hooks personnalisés
│   │   ├── services/      # API calls
│   │   └── types/         # Types TypeScript
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── routes/        # Routes Express
│   │   ├── controllers/   # Logique métier
│   │   ├── services/      # Services (export, whisper)
│   │   └── types.ts       # Types partagés
│   └── ...
│
└── ...
```

## Checklist avant Pull Request

- [ ] Le code compile sans erreurs
- [ ] Le code fonctionne en local (frontend + backend)
- [ ] Testé sur mobile et desktop
- [ ] Testé sur différents navigateurs
- [ ] Pas de console.log oubliés
- [ ] Pas de code commenté inutile
- [ ] Documentation mise à jour si nécessaire
- [ ] README.md mis à jour si nouvelle fonctionnalité
- [ ] Commits bien formatés

## Idées de contribution

Besoin d'inspiration ? Voici des idées :

### Fonctionnalités

- [ ] Support de plusieurs langues pour la transcription
- [ ] Détection automatique de la langue
- [ ] Identification des différents speakers
- [ ] Résumé automatique de la réunion
- [ ] Mots-clés et tags
- [ ] Recherche avancée dans les transcriptions
- [ ] Partage de réunions par lien
- [ ] Thème sombre
- [ ] Notifications push
- [ ] Mode offline

### Améliorations techniques

- [ ] Tests unitaires et d'intégration
- [ ] CI/CD avec GitHub Actions
- [ ] Performance : lazy loading des pages
- [ ] Optimisation de la taille des bundles
- [ ] Service Worker pour le mode offline
- [ ] Websockets pour la sync temps réel
- [ ] GraphQL au lieu de REST
- [ ] Migration vers Next.js

### Documentation

- [ ] Vidéos tutorielles
- [ ] FAQ
- [ ] Exemples d'utilisation
- [ ] API documentation (Swagger)
- [ ] Traduction de la doc en anglais

## Questions ?

N'hésitez pas à :
- Ouvrir une Issue pour poser des questions
- Demander de l'aide dans les Pull Requests
- Proposer des améliorations à ce guide

Merci pour votre contribution ! 🙏

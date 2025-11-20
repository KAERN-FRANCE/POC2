# Guide d'Utilisation

## Démarrage rapide

### 1. Créer une nouvelle réunion

1. Ouvrez l'application dans votre navigateur
2. Cliquez sur **"Nouvelle réunion"** sur la page d'accueil
3. Donnez un nom à votre réunion (ex: "Réunion d'équipe - 20/11/2024")
4. Appuyez sur Entrée ou cliquez sur le bouton microphone

### 2. Autoriser l'accès au microphone

Lors de votre première utilisation :
- Votre navigateur demandera l'autorisation d'accès au microphone
- Cliquez sur **"Autoriser"**
- Cette autorisation sera mémorisée pour les prochaines fois

### 3. Enregistrer et transcrire

Une fois l'enregistrement lancé :
- **Parlez normalement** - la transcription se fait automatiquement
- **Visualisez** le niveau audio en temps réel
- **Lisez** la transcription qui apparaît au fur et à mesure
- **Mettez en pause** si besoin avec le bouton pause
- **Reprenez** l'enregistrement avec le bouton play

### 4. Arrêter et sauvegarder

Pour terminer l'enregistrement :
1. Cliquez sur le bouton **rouge carré** (Stop)
2. L'enregistrement et la transcription sont automatiquement sauvegardés
3. Vous êtes redirigé vers la page de détails de la réunion

## Fonctionnalités principales

### Enregistrement audio

**Formats supportés :**
- WebM (par défaut, meilleure qualité)
- WAV (si WebM non disponible)

**Qualité :**
- 128 kbps
- 44.1 kHz
- Suppression de bruit activée
- Annulation d'écho activée

**Durée maximale :**
- Illimitée (limité par l'espace disque)

### Transcription en temps réel

**Deux modes disponibles :**

#### 1. Web Speech API (par défaut)
- ✅ Gratuit
- ✅ Temps réel dans le navigateur
- ✅ Aucune configuration requise
- ⚠️ Nécessite une connexion internet
- ⚠️ Qualité variable selon le navigateur

**Navigateurs supportés :**
- Chrome / Chromium ✅
- Edge ✅
- Safari ✅
- Firefox ❌ (pas de support Web Speech API)

#### 2. OpenAI Whisper API (optionnel)
- ✅ Très haute qualité
- ✅ Support multilingue excellent
- ✅ Fonctionne sur tous les navigateurs
- ⚠️ Nécessite une clé API OpenAI (payant)
- ⚠️ Transcription après l'enregistrement

### Gestion des réunions

**Voir toutes les réunions :**
- Cliquez sur **"Réunions"** dans le menu
- Triées par date (plus récentes en premier)
- Affiche : titre, date, durée, nombre de segments

**Rechercher une réunion :**
- Utilisez la barre de recherche en haut de la liste
- Recherche dans les titres et les transcriptions
- Résultats instantanés

**Consulter une réunion :**
- Cliquez sur une réunion dans la liste
- Voir tous les détails : transcription complète, timestamps, durée
- Télécharger l'audio original
- Exporter la transcription

**Supprimer une réunion :**
- Cliquez sur l'icône poubelle
- Confirmez la suppression
- ⚠️ Action irréversible !

### Export des transcriptions

Plusieurs formats disponibles :

#### 1. Format TXT
- Fichier texte brut
- Facile à ouvrir avec n'importe quel éditeur
- Inclut les timestamps
- Parfait pour le partage rapide

#### 2. Format JSON
- Données structurées
- Inclut toutes les métadonnées
- Parfait pour l'intégration avec d'autres outils
- Permet le post-traitement

#### 3. Format PDF
- Document professionnel
- Mise en page soignée
- Inclut titre, date, durée, timestamps
- Parfait pour l'archivage et le partage

**Comment exporter :**
1. Ouvrez une réunion
2. Cliquez sur le bouton d'export souhaité
3. Le fichier est automatiquement téléchargé

## Utilisation mobile

L'application est entièrement responsive et fonctionne sur mobile !

### Configuration pour mobile

**Sur iOS (Safari) :**
1. Ouvrez l'application dans Safari
2. Autorisez l'accès au microphone
3. ✅ Fonctionne parfaitement

**Sur Android (Chrome) :**
1. Ouvrez l'application dans Chrome
2. Autorisez l'accès au microphone
3. ✅ Fonctionne parfaitement

**Important pour mobile :**
- Utilisez une connexion stable (WiFi recommandé)
- Gardez le téléphone proche de vous pendant l'enregistrement
- La transcription fonctionne même écran verrouillé
- Évitez de changer d'application pendant l'enregistrement

### Astuces pour une meilleure transcription

1. **Parlez clairement** - articulez bien
2. **Évitez le bruit ambiant** - trouvez un endroit calme
3. **Gardez une distance constante** du microphone
4. **Évitez les interruptions** - coupez les notifications
5. **Connexion stable** - vérifiez votre connexion internet
6. **Testez avant** - faites un test de 10 secondes d'abord

### Raccourcis clavier

Sur ordinateur, utilisez ces raccourcis :

- **Espace** - Démarrer/Arrêter l'enregistrement (sur la page d'enregistrement)
- **P** - Pause/Reprendre
- **S** - Arrêter et sauvegarder
- **Échap** - Annuler et revenir en arrière

## Cas d'usage

### Réunion d'équipe
1. Créez une réunion avec un nom descriptif
2. Lancez l'enregistrement au début de la réunion
3. Laissez l'application tourner pendant la réunion
4. Arrêtez à la fin
5. Partagez la transcription PDF avec l'équipe

### Interview
1. Testez le son avant l'interview
2. Lancez l'enregistrement
3. Consultez la transcription en temps réel si besoin
4. Exportez en TXT pour l'analyse

### Cours / Formation
1. Enregistrez le cours entier
2. Consultez la transcription pour réviser
3. Exportez en PDF pour vos notes

### Brainstorming
1. Enregistrez toutes les idées
2. Relisez la transcription
3. Identifiez les points clés
4. Exportez pour documentation

## Limitations connues

- **Firefox** ne supporte pas Web Speech API → utilisez Chrome
- **Taille des fichiers** : les très longues réunions (>2h) peuvent créer de gros fichiers
- **Transcription** : la qualité dépend de la qualité audio et du bruit ambiant
- **Langues** : optimisé pour le français, mais supporte d'autres langues

## Conseils de sécurité

- ⚠️ **Ne partagez jamais** votre clé API OpenAI
- 🔒 Gardez vos réunions confidentielles privées
- 💾 Sauvegardez régulièrement vos réunions importantes
- 🗑️ Supprimez les réunions sensibles après usage

## Support et aide

Besoin d'aide ? Vérifiez :
- Ce guide d'utilisation
- Le fichier INSTALLATION.md
- Le README.md
- Les logs du navigateur (F12 → Console)

Bon enregistrement ! 🎤

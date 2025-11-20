FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY tsconfig.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY src ./src

# Compiler TypeScript
RUN npm run build

# Créer les dossiers nécessaires
RUN mkdir -p /app/data /app/uploads

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]

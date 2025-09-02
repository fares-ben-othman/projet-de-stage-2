# -------- Étape 1 : build des dépendances --------
FROM node:18-alpine AS build

# Installer outils nécessaires pour compiler bcrypt ou autres modules natifs
RUN apk add --no-cache python3 make g++

# Dossier de travail
WORKDIR /app

# Copier uniquement les fichiers de dépendances
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm ci --omit=dev

# -------- Étape 2 : image finale --------
FROM node:18-alpine

WORKDIR /app

# Copier node_modules de l’étape build
COPY --from=build /app/node_modules ./node_modules

# Copier ton code (sans node_modules, data_base, etc. grâce au .dockerignore)
COPY code/ . 

# Variables d’environnement
ENV NODE_ENV=production
ENV PORT=3000

# Exposer le port
EXPOSE 3000

# Lancer l’application
CMD ["node", "index.js"]

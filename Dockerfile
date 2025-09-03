# -------- Étape 1 : build des dépendances --------
FROM node:18-alpine AS build

RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copier uniquement les fichiers nécessaires pour installer les dépendances
COPY package.json package-lock.json ./

RUN npm ci --omit=dev

# -------- Étape 2 : image finale --------
FROM node:18-alpine

WORKDIR /app

# Copier node_modules depuis l'étape build
COPY --from=build /app/node_modules ./node_modules

# Copier les fichiers de configuration
COPY package.json ./

# Copier le code source depuis le dossier 'code'
COPY code/ ./code/

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Assurez-vous que le point d'entrée est correct
CMD ["node", "code/index.js"]  # Adjust if index.js is in a different location
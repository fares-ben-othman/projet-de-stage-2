# -------- Étape 1 : build des dépendances --------
FROM node:18-alpine AS build

RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copier uniquement les fichiers nécessaires pour installer les dépendances
COPY code/package*.json ./

RUN npm install --omit=dev

# -------- Étape 2 : image finale --------
FROM node:18-alpine

WORKDIR /app

# Copier node_modules depuis l'étape build
COPY --from=build /app/node_modules ./node_modules

# Copier le code source
COPY code/ . 

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "index.js"]

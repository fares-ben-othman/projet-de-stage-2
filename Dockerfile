# -------- Étape 1 : build des dépendances --------
FROM node:18-alpine AS build

RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy dependency files
COPY package*.json ./

RUN npm install --omit=dev

# -------- Étape 2 : image finale --------
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules

# Copy source code
COPY code/ . 

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "index.js"]

# Utilise une image de base Node.js
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Installer iproute2
RUN apt-get update && apt-get install -y iproute2

# Copier les fichiers du serveur
COPY package.json package-lock.json ./
RUN npm install


# Copier le reste du code
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Démarrer le serveur
CMD ["node", "server.js"]

# Imagen base de Node (puedes cambiar a 20, 18, etc.)
FROM node:18-alpine

# Directorio de trabajo
WORKDIR /app

# Copiamos solo package.json/package-lock.json para aprovechar cache
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Puerto expuesto por el servidor Express
EXPOSE 4000

# Por defecto arrancamos el servidor
CMD ["node", "server.js"]

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente
COPY . .

# Compilar TypeScript y buildear con Vite
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Instalar servidor http simple
RUN npm install -g serve

# Copiar el directorio dist del stage anterior
COPY --from=builder /app/dist ./dist

# Exponer puerto
EXPOSE 3000

# Comando para servir la aplicación
CMD ["serve", "-s", "dist", "-l", "3000"]

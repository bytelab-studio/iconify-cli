# --- Stage 1: Build stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Build the VitePress docs (from /docs)
RUN npm run docs:build

# --- Stage 2: Production stage ---
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# Copy only the built VitePress output
COPY --from=builder /app/docs/.vitepress/dist ./

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
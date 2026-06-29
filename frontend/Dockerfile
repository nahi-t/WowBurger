# --- STAGE 1: Build the React application ---
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package management files
COPY package*.json ./
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the production assets
RUN npm run build

# --- STAGE 2: Serve the production assets with Nginx ---
FROM nginx:alpine

# Copy the static assets from the builder stage
# NOTE: If you use Vite, the build folder is /app/dist. If you use Create React App, change it to /app/build
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for the Nginx web server
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
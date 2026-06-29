# --- STAGE 1: Build ---
FROM node:22-alpine AS builder
WORKDIR /usr/src/app

# Copy package management files to install cacheable layers
COPY package*.json ./
RUN npm ci

# Copy the rest of your NestJS application source code
COPY . .

# Compile TypeScript to JavaScript (generates the /dist folder)
RUN npm run build

# --- STAGE 2: Run ---
FROM node:22-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy package files and install ONLY production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the compiled production code from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose the default NestJS port
EXPOSE 3000

# Switch to a non-root secure user
USER node

# Start the NestJS app
CMD ["node", "dist/main.js"]
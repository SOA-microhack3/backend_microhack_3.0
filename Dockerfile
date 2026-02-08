# Use Node 18 Alpine (Lightweight)
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Generate Prisma Client (CRITICAL for Database access)

# Build the NestJS application
RUN npm run build

# Expose the API port
EXPOSE 3001

# Start the server (using the built file, not dev mode)
CMD ["node", "dist/main"]
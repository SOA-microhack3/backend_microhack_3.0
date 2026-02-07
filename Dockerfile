# Use Node 18 Alpine (Lightweight)
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Generate Prisma Client (CRITICAL for Database access)
# If you don't use Prisma, remove this line.
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# Expose the API port
EXPOSE 3000

# Start the server (using the built file, not dev mode)
CMD ["node", "dist/main"]
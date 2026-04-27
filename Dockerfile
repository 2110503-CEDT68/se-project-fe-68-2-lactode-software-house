FROM node:20-slim

# Use a clean working dir
WORKDIR /app

# Prevents cache issues with host node_modules
COPY package.json package-lock.json* ./

# Clean fresh install + optional deps + force Linux-native rebuild

RUN npm install 

# Copy all source files AFTER install
COPY . .

# Expose the default dev port
EXPOSE 3000

# Enable .env file
ENV NODE_ENV=development

# Start Next.js in dev mode
CMD ["npm", "run", "dev"]
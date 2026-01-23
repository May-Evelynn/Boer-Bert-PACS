# Use Node.js LTS Alpine image for smaller size
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Expose the port (default 3000, can be overridden via PORT env)
EXPOSE 3000

# Start the application
CMD ["node", "main.js"]

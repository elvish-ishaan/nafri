FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Build the application
RUN npx prisma generate && npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]

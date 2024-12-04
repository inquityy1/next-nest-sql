# Use the official Node.js image as the base
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy tsconfig.json for proper typescript configuration
COPY tsconfig.json ./

# Copy .env for environment variables
COPY .env ./

# Install dependencies (use legacy-peer-deps to avoid potential issues with versions)
RUN npm install --legacy-peer-deps --build-from-source

# Copy the rest of the application code (source files)
COPY . .

# # Run tests before building the app
# RUN npm run test

# Build the app for production (using production build)
RUN npm run build


# Expose the port your backend is running on (e.g., 3000)
EXPOSE 3000

# Command to run the application in production mode
CMD ["npm", "run", "start"]
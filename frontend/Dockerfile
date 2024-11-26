# Use the official Node.js image as the base
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy jsconfig.json for correct path resolution
COPY jsconfig.json ./

# Copy .env for environment variables
COPY .env ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the frontend (production build of Next.js)
RUN npm run build

# Expose the port your frontend is running on (e.g., 3001)
EXPOSE 3001

# Command to run the application (production mode)
CMD ["npm", "run", "start"]
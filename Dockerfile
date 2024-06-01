# Use the official Node.js image as a base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Change ownership of the working directory
RUN chown -R node:node /app

# Switch to the node user
USER node

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY --chown=node:node . .

# Generate Prisma client
RUN npx prisma generate

# # Deploy Prisma client
# RUN npx prisma migrate deploy

# # Seed Prisma client
# RUN npx prisma db seed

# Build the NestJS application
RUN npm run build

# List the contents of the build directory for debugging
RUN ls -al /app/dist

# Expose the port the app runs on
EXPOSE 5510

# Print the contents of the dist directory and start the application
CMD ls -al /app/dist && npm run start:prod

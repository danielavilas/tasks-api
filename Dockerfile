# Use a Node.js image as base
FROM node:21-alpine3.18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install all project dependencies
RUN npm install

# Copy the rest of the project files to the working directory
COPY . .
COPY src/schema.graphql .

# Compile TypeScript code
RUN npm run build

# Expose the port on which the application will be running
EXPOSE 3000

# Command to start the application when the container is started
CMD ["npm", "start"]

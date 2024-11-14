# Step 1: Use an official Node.js image as the base image
FROM node:20.18.0 AS builder

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (or yarn.lock) for dependency installation
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code into the container
COPY . .

# Step 6: Build the Next.js app (this will prepare it for SSR)
RUN npm run build

# Step 7: Expose the port on which Next.js will run
EXPOSE 3000

# Step 8: Start the Next.js server for SSR
CMD ["npm", "run", "start"]

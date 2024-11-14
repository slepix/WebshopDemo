# Use the official Node.js 20-alpine image as the base for the build stage
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy only package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install only production dependencies first for caching
RUN npm ci --only=production

# Install development dependencies after to prepare for building
COPY package*.json ./
RUN npm ci

# Copy the entire application code to the container
COPY . .

# Ensure the public folder exists
RUN mkdir -p /app/public

# Build the Next.js app
RUN npm run build

# Prune dev dependencies to minimize the final image
RUN npm prune --production


# Use the official Node.js 18-alpine as the base for the final production image
FROM node:18-alpine AS runtime

# Set the working directory
WORKDIR /app

# Copy production dependencies and built application from build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# Expose port 3000 for the application
EXPOSE 3000

# Run the app as a non-root user for security
USER node

# Set environment to production
ENV NODE_ENV=production

# Start the Next.js application
CMD ["npm", "start"]

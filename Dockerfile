# Stage 1: Dependencies
FROM node:22.12.0-alpine AS dependencies

WORKDIR /app

# Copy package configuration files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Stage 2: Production
FROM node:22.12.0-alpine AS production

LABEL maintainer="RUBYBHV"
LABEL description="Fragments node.js microservice"

# Use /app as our working directory
WORKDIR /app

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
ENV NPM_CONFIG_COLOR=false

# Copy production node_modules from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./

# Copy src and test secrets
COPY ./src ./src
COPY ./tests/.htpasswd ./tests/.htpasswd

# Expose port 8080
EXPOSE 8080

# Start the container by running our server
CMD ["npm", "start"]

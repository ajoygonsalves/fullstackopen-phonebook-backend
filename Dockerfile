# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=21.6.1
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install pnpm
ARG PNPM_VERSION=8.15.3
RUN npm install -g pnpm@$PNPM_VERSION

# Install node modules
COPY --link package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy application code
COPY --link . .

# Copy the dist directory
COPY --link dist ./dist

# Expose port
EXPOSE 3001

# Set the environment variable for the port
ENV PORT 3001

# Start the server by default, this can be overwritten at runtime
CMD [ "pnpm", "start" ]

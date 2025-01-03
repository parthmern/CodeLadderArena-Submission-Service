FROM node:20.12.0-alpine3.19

# Declare build arguments for the variables
ARG PORT
ARG REDIS_PORT
ARG REDIS_HOST
ARG ATLAS_DB_URL
ARG NODE_ENV
ARG PROBLEM_ADMIN_SERVICE_URL
ARG SOCKET_SERVICE_URL

WORKDIR /usr/app/

COPY package.json package-lock.json ./ 

COPY src ./src

RUN npm ci

# Set environment variables for the running container
ENV PORT=$PORT
ENV REDIS_PORT=$REDIS_PORT
ENV REDIS_HOST=$REDIS_HOST
ENV REDIS_PASSWORD=$REDIS_PASSWORD
ENV ATLAS_DB_URL=$ATLAS_DB_URL
ENV NODE_ENV=$NODE_ENV
ENV PROBLEM_ADMIN_SERVICE_URL=$PROBLEM_ADMIN_SERVICE_URL
ENV SOCKET_SERVICE_URL=$SOCKET_SERVICE_URL

# Print all environment variables when the container starts
CMD printenv && npm run dev

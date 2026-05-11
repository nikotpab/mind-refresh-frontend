# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy built files to nginx
# Note: Angular 17+ usually builds to dist/project-name/browser
COPY --from=builder /app/dist/mind-refresh-frontend/browser /usr/share/nginx/html

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK CMD curl --fail http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

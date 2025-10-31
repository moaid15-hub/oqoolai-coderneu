# 🐳 OqoolAI Cloud IDE - Multi-stage Docker Build

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend

# Copy frontend package files
COPY packages/cloud-editor/frontend/package*.json ./
RUN npm ci --only=production

# Copy frontend source and build
COPY packages/cloud-editor/frontend/ ./
RUN npm run build

# Stage 2: Build Backend  
FROM node:20-alpine AS backend-build
WORKDIR /app/backend

# Copy backend package files
COPY packages/cloud-editor/backend/package*.json ./
RUN npm ci --only=production

# Copy backend source
COPY packages/cloud-editor/backend/ ./

# Stage 3: Production Runtime
FROM node:20-alpine AS production

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    bash \
    && rm -rf /var/cache/apk/*

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S oqool -u 1001 -G nodejs

# Set working directory
WORKDIR /app

# Copy backend from build stage
COPY --from=backend-build --chown=oqool:nodejs /app/backend ./backend
COPY --from=frontend-build --chown=oqool:nodejs /app/frontend/dist ./frontend/dist

# Copy shared utilities if needed
COPY --chown=oqool:nodejs packages/shared/ ./shared/

# Install production dependencies for shared modules
COPY --chown=oqool:nodejs package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Health check script
COPY --chown=oqool:nodejs <<EOF /app/healthcheck.js
const http = require('http');
const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3001,
  path: '/api/health',
  method: 'GET',
  timeout: 2000,
};

const request = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', () => {
  process.exit(1);
});

request.on('timeout', () => {
  request.destroy();
  process.exit(1);
});

request.end();
EOF

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001
ENV FRONTEND_DIR=/app/frontend/dist

# Expose ports
EXPOSE 3001

# Switch to non-root user
USER oqool

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node /app/healthcheck.js

# Start the application
WORKDIR /app/backend
CMD ["npm", "start"]
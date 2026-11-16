FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY *.js ./
FROM node:24-alpine
WORKDIR /app
RUN addgroup -S appuser && adduser -S -D -H -G appuser appuser
COPY --from=build /app /app
RUN chown -R appuser:appuser /app && rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack
USER appuser
EXPOSE 3000
CMD ["node","servidor.js"]
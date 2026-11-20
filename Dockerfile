FROM node:22-alpine AS ui-builder
WORKDIR /workspace/angular-wprocesso-coop-ui
COPY angular-wprocesso-coop-ui/package*.json ./
RUN npm ci --no-audit --no-fund --prefer-offline
COPY angular-wprocesso-coop-ui/ ./
RUN npm run build

FROM node:22-alpine AS builder
WORKDIR /workspace/angular-wprocesso-coop-credito
COPY --from=ui-builder /workspace/angular-wprocesso-coop-ui/dist/angular-wprocesso-coop-ui /workspace/angular-wprocesso-coop-ui/dist/angular-wprocesso-coop-ui
COPY angular-wprocesso-coop-credito/package*.json ./
RUN npm ci --no-audit --no-fund --prefer-offline
COPY angular-wprocesso-coop-credito/ ./
RUN npm run build:docker

FROM nginx:1.27-alpine
COPY angular-wprocesso-coop-credito/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /workspace/angular-wprocesso-coop-credito/dist/angular-wprocesso-coop-credito/browser /usr/share/nginx/html
EXPOSE 4202
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://localhost:4202/remoteEntry.json > /dev/null || exit 1
CMD ["nginx", "-g", "daemon off;"]

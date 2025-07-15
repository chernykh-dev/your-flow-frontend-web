# 1. Build stage
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# 2. Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove default nginx conf and add custom one (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
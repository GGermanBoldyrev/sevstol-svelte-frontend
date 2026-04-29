FROM oven/bun:1.2-slim AS builder
WORKDIR /app
COPY . .
RUN bun install && bun run build

FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
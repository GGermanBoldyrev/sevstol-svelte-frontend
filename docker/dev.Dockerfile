FROM oven/bun:1.2-slim

WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install

COPY . .

EXPOSE 5173

CMD ["bun", "--bun", "run", "dev", "--host", "0.0.0.0"]
FROM node:20-alpine

RUN apk add --no-cache ca-certificates libc6-compat
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

EXPOSE 3000

ENV HOSTNAME="0.0.0.0"

CMD ["pnpm", "run", "dev"]
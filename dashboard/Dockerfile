FROM node:20-alpine


RUN apk add --no-cache ca-certificates
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

EXPOSE 5173

ENV HOSTNAME="0.0.0.0"

CMD ["pnpm", "run", "dev"]
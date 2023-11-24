FROM node:18.17.1-buster

ARG NODE_ENV=production

WORKDIR /app

COPY package* ./
COPY src ./src
COPY tsconfig* ./

RUN npm ci
RUN npm run build

CMD node dist/scheduler/main.js

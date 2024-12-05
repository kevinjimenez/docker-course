# primera parte o fase
FROM node:19.2.0-alpine3.16 AS deps
WORKDIR /app
COPY package.json ./
RUN npm install


# segunda parte o fase (ese una nueva fase como si la primera no se hubiera ejecutado pero se puede hacer referencia a ella)
FROM node:19.2.0-alpine3.16 AS builder
WORKDIR /app
# COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run test


# tercera parte o fase
FROM node:19.2.0-alpine3.16 AS prod-deps
WORKDIR /app
COPY package.json ./
RUN npm install --prod


# cuarta parte o fase
FROM node:19.2.0-alpine3.16 AS runner
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY app.js ./
COPY task/ ./task
CMD [ "node", "app.js" ]

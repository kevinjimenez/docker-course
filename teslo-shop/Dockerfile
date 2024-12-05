FROM node:19-alpine3.15 as dev
WORKDIR /app
COPY package.json package.json
RUN npm install
CMD [ "npm", "run", "start:dev" ]



FROM node:19-alpine3.15 as dev-deps
WORKDIR /app
COPY package.json package.json
RUN npm i


FROM node:19-alpine3.15 as builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
# RUN yarn test
RUN npm run build

FROM node:19-alpine3.15 as prod-deps
WORKDIR /app
COPY package.json package.json
RUN npm install --prod


FROM node:19-alpine3.15 as prod
EXPOSE 3000
WORKDIR /app
ENV APP_VERSION=${APP_VERSION}
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

CMD [ "npm", "run", "start:prod" ]










FROM node:16-alpine

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY .env.example ./

ENV NODE_ENV production
ENV TZ Asia/Seoul

RUN yarn install --immutable --immutable-cache --check-cache --prod

COPY ./dist ./dist

CMD ["node", "./dist/index.js"]
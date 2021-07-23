FROM node:12.18.4-alpine

WORKDIR /app
COPY . /app
RUN yarn install && NODE_ENV=production yarn build
EXPOSE 3000

CMD ["yarn", "start"]
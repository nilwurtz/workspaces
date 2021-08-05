FROM node:16-buster-slim

WORKDIR /app

COPY package* ./
RUN npm i

USER node
COPY . ./

EXPOSE 3000
CMD [ "npm", "run", "dev" ]
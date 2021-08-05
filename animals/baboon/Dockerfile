FROM node:16-buster-slim

WORKDIR /app
COPY package* ./
RUN npm i

COPY . ./

USER node
EXPOSE 3001
CMD [ "npm", "run", "dev" ]
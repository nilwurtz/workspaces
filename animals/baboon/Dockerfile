FROM node:16-buster-slim

WORKDIR /app
USER node
COPY package* ./
RUN npm i

COPY . ./

USER node
EXPOSE 3001
CMD [ "npm", "run", "dev" ]
FROM node:16-buster-slim

WORKDIR /app
USER node
COPY package* ./
RUN npm i

COPY . ./

EXPOSE 3000
CMD [ "npm", "run", "dev" ]
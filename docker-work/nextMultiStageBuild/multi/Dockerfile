FROM node:12.18.4-alpine AS base

WORKDIR /base
COPY . .
RUN yarn install


FROM base AS build
WORKDIR /build
COPY --from=base /base ./
RUN NODE_ENV=production yarn build

FROM node:12.18.4-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /build/package.json /build/yarn.lock ./
COPY --from=build /build/.next ./.next
COPY --from=build /build/public ./public
RUN yarn add next

EXPOSE 3000
CMD ["yarn", "start"]
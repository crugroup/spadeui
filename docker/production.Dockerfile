FROM node:18 AS build
COPY . /app
WORKDIR /app
RUN yarn install && yarn run build

FROM nginx:1.17.8-alpine
COPY --from=build /app/dist /etc/nginx/html
COPY ./docker/default.conf /etc/nginx/conf.d/default.conf

FROM node:18-alpine3.19 AS build
COPY . /app
WORKDIR /app
# needed to ensure the arm64 build doesn't timeout
RUN yarn config set network-timeout 300000
RUN yarn install && yarn run build

FROM nginx:1.17.8-alpine
COPY --from=build /app/dist /etc/nginx/html
COPY ./docker/default.conf /etc/nginx/conf.d/default.conf

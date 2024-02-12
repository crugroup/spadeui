FROM --platform=$BUILDPLATFORM node:18-alpine3.19 AS build
COPY . /app
WORKDIR /app
RUN yarn install && yarn run build

FROM nginx:1.25.3-alpine
COPY --from=build /app/dist /etc/nginx/html
COPY ./docker/default.conf /etc/nginx/conf.d/default.conf
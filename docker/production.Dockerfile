FROM --platform=$BUILDPLATFORM node:current-alpine AS build
COPY . /app
WORKDIR /app
RUN yarn install && yarn run build

FROM nginx:latest
COPY --from=build /app/dist /etc/nginx/html
COPY ./public /etc/nginx/html/public
COPY ./docker/default.conf /etc/nginx/conf.d/default.conf
COPY ./docker/entrypoint /
ENTRYPOINT ["/entrypoint"]
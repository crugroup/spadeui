FROM --platform=$BUILDPLATFORM node:18-alpine3.19 AS build
COPY . /app
WORKDIR /app
RUN yarn install && yarn run build

FROM nginx:1.25.3-alpine
ENV VITE_BACKEND_BASE_URL=http://localhost:8000/api/v1
COPY --from=build /app/dist /etc/nginx/html
COPY ./public /etc/nginx/html/public
COPY ./docker/default.conf /etc/nginx/conf.d/default.conf
COPY ./docker/entrypoint /
ENTRYPOINT ["/entrypoint"]
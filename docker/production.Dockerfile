FROM --platform=$BUILDPLATFORM node:18-alpine3.19 AS build
ARG SPADE_API_URL=http://localhost:8000/api/v1
COPY . /app
WORKDIR /app
RUN echo "REACT_APP_SPADE_API_URL=${SPADE_API_URL}" > .env
RUN  yarn install && yarn run build

FROM nginx:1.25.3-alpine
COPY --from=build /app/dist /etc/nginx/html
COPY ./public /etc/nginx/html/public
COPY ./docker/default.conf /etc/nginx/conf.d/default.conf

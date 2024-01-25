FROM node:18

COPY . /app
WORKDIR /app
RUN yarn install --immutable --production

EXPOSE 3000

CMD ["yarn", "start"]

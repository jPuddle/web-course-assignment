FROM node:12
WORKDIR /app
COPY ./package.json ./yarn.lock /app/
RUN yarn install
COPY . /app
RUN yarn build
EXPOSE 8080
CMD node src/server.js
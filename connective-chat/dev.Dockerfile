FROM node:16-alpine

WORKDIR /src
COPY ./ /src/
RUN npm install
ENV NODE_ENV=development
RUN npm install -g nodemon
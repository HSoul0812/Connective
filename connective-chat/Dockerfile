FROM node:16-alpine

WORKDIR /src
COPY ./ /src/
RUN npm install
ENV NODE_ENV=production
RUN npm install -g pm2
RUN npm run build
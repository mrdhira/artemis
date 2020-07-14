FROM node:12.18.2-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk --no-cache add \
      bash \
      git

RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "start"]
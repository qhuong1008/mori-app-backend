FROM node:18

WORKDIR /app

COPY package.json .

RUN npm install

COPY storage app

COPY . .

CMD npm run prod
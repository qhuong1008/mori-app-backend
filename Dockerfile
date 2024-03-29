FROM node:18

WORKDIR /app

COPY package.json .

RUN npm install

# Sao chép các tệp hình ảnh, âm thanh và tệp epub vào Docker Image
COPY . .

CMD npm run prod

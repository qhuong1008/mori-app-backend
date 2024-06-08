FROM node:18

WORKDIR /app

COPY package.json .

RUN npm install

COPY storage app

COPY . .

CMD npm run prod

# Flask service
FROM python:3.9 AS flask

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY recommendation_systems /app/recommendation_systems

CMD python recommendation_systems/recommend_books.py
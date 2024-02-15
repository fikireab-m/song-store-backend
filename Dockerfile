FROM node:20-lts

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY ./src ./dist
EXPOSE 5000

CMD ["concurrently", "tsc -w", "nodemon dist/index.js"]

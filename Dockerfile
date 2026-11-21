FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY src ./src

ENV PORT=80
EXPOSE 80

CMD ["node", "src/server.js"]

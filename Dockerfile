FROM node:18-slim

WORKDIR /app/

COPY package.json ./
RUN npm install

COPY server.js ./
COPY db.sqlite3 ./
COPY src/ ./src
COPY public ./public
COPY logs.txt ./

RUN npm run build

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD [ "node", "server.js" ]

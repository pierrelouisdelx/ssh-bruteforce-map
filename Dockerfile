FROM node:18-slim

WORKDIR /app/

COPY package.json ./
RUN npm install

COPY server.js ./
COPY src/ ./src
COPY public ./public

RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD [ "node", "server.js" ]

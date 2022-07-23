FROM node:18-slim

WORKDIR /app/
COPY package.json ./
COPY server.js ./

RUN npm install
COPY src/ ./src
COPY public ./public
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD [ "node", "index.js" ]

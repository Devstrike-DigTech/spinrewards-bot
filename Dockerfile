FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production=false

COPY . .
RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000 3001

CMD ["node", "dist/index.js"]

FROM node:20
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build
RUN npm prune --production
EXPOSE 3000
CMD ["node", "src/server.js"]

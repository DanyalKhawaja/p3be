FROM node:carbon
WORKDIR /node-api-demo
COPY package*.json ./
RUN npm install --only=production
COPY . .
CMD ["npm", "start"]
EXPOSE  8882 444

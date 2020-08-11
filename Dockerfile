FROM node:carbon
WORKDIR /node-api-prod
COPY package*.json ./
RUN npm install --only=production
COPY . .
CMD ["npm", "start"]
EXPOSE  8881 443

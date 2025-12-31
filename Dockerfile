FROM node:18-alpine
WORKDIR /src/app
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE  8882 444
CMD ["npm", "start"]
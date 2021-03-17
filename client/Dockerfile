FROM node:alpine

WORKDIR /app

copy package.json .
RUN npm install --only=prod

COPY . .

CMD ["npm", "run", "dev"]
FROM node:20.9.0

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

COPY certs /etc/ssl/

CMD ["npm", "run", "start:dev"]

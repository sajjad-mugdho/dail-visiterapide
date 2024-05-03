FROM node:18.3.0-alpine3.15

# Create app directory

WORKDIR /app

# Install app dependencies
COPY . .
COPY .env .env

RUN npm install

# Bundle app source

EXPOSE 5000

CMD [ "npm", "start" ]



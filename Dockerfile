FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app deps
COPY package*.json ./
RUN npm ci --omit=dev

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]
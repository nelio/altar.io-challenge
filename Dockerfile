
FROM node:22-alpine3.19

WORKDIR /workdir

COPY package*.json ./
RUN npm install --omit=dev
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
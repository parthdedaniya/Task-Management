FROM node:18-alpine

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Default command (can be overridden in docker-compose)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]


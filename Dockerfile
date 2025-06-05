FROM node:16 as build-stage
WORKDIR /app
COPY package*.json ./
RUN yarn config set ignore-engines true
RUN yarn install
COPY . .
RUN mkdir /dist
CMD ["sh", "-c", "yarn build && mkdir -p /dist && cp -r /app/dist/* /dist"]
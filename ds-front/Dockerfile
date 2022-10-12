FROM node:lts-alpine as build-stage
ARG SERVER_ADDRESS
ENV VITE_SERVER_ADDRESS=$SERVER_ADDRESS

WORKDIR /ds-front
COPY package.json ./
RUN npm set progress=false && npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:lts-alpine as prod-stage
COPY --from=build-stage /ds-front/dist /ds-front/dist
RUN npm install -g serve
FROM node:lts-alpine as build-stage
WORKDIR /ds-back
COPY package.json ./
RUN npm set progress=false && npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:lts-alpine as prod-stage
COPY --from=build-stage /ds-back/dist /ds-back/dist
COPY --from=build-stage /ds-back/node_modules /ds-back/node_modules
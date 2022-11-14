FROM node:lts-alpine as build-stage
#WORKDIR /dreamscape
COPY /ds-front/package.json /ds-front
COPY /ds-back/package.json /ds-back

RUN npm set progress=false
# install, copy, build frontend
RUN npm i --legacy-peer-deps --prefix=/ds-front/
COPY /ds-front /ds-front
RUN npm run build --legacy-peer-deps --prefix=/ds-front/
# install, copy, build backend
RUN npm i --legacy-peer-deps --prefix=/ds-back/
COPY /ds-back /ds-back
RUN npm run build --legacy-peer-deps --prefix=/ds-back/

FROM node:lts-alpine as prod-stage
# copy frontend to prod
COPY --from=build-stage /ds-front/dist /ds-front/dist
COPY --from=build-stage /ds-front/node_modules /ds-front/node_modules
# copy backend to prod
COPY --from=build-stage /ds-back/dist /ds-back/dist
COPY --from=build-stage /ds-back/node_modules /ds-back/node_modules
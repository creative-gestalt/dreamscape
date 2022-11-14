FROM node:lts-alpine as build-stage
# make directores
RUN mkdir /home/node/ds-front && mkdir /home/node/ds-back
# copy package.json files for install
COPY ./ds-front/package.json /home/node/ds-front
COPY ./ds-back/package.json /home/node/ds-back

RUN npm set progress=false
# install, copy, build frontend
RUN cd /home/node/ds-front && npm i --legacy-peer-deps
COPY ./ds-front /home/node/ds-front
RUN cd /home/node/ds-front && npm run build
# install, copy, build backend
RUN cd /home/node/ds-back && npm i --legacy-peer-deps
COPY ./ds-back /home/node/ds-back
RUN cd /home/node/ds-back && npm run build

FROM node:lts-alpine as prod-stage
# copy frontend to prod
COPY --from=build-stage /home/node/ds-front/dist /ds-front/dist
COPY --from=build-stage /home/node/ds-front/node_modules /ds-front/node_modules
# copy backend to prod
COPY --from=build-stage /home/node/ds-back/dist /ds-back/dist
COPY --from=build-stage /home/node/ds-back/node_modules /ds-back/node_modules
CMD /ds-front/serve dist -l 8080
CMD /ds-back/node dist/main
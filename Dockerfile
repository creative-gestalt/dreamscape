FROM node:lts-alpine as build-stage
# copy entrypoint
COPY ./entrypoint.sh /home/node/entrypoint.sh
# make app directores
RUN mkdir /home/node/ds-front && mkdir /home/node/ds-back
# copy package.json files for install
COPY ./ds-front/package.json /home/node/ds-front
COPY ./ds-back/package.json /home/node/ds-back

RUN npm set progress=false
# install, copy, build frontend
RUN cd /home/node/ds-front && npm i --legacy-peer-deps
COPY ./ds-front /home/node/ds-front

# install, copy, build backend
RUN cd /home/node/ds-back && npm i --legacy-peer-deps
COPY ./ds-back /home/node/ds-back
RUN cd /home/node/ds-back && npm run build

FROM node:lts-alpine as prod-stage
# copy entrypoint
COPY --from=build-stage /home/node/entrypoint.sh /entrypoint.sh
# copy frontend to prod
COPY --from=build-stage /home/node/ds-front/ /ds-front/
# copy backend to prod
COPY --from=build-stage /home/node/ds-back/dist /ds-back/dist
COPY --from=build-stage /home/node/ds-back/node_modules /ds-back/node_modules
# install serve for frontend
RUN npm i -g pm2
# expose ports and run servers
EXPOSE 8080 3000
CMD ["sh", "-c", "sh entrypoint.sh"]
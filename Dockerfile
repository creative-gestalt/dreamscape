FROM node:lts-alpine as build-stage
# make app directores
RUN mkdir /home/node/ds-front && mkdir /home/node/ds-back
# copy package.json files for install
COPY ./ds-front/package.json /home/node/ds-front
COPY ./ds-back/package.json /home/node/ds-back

# install yarn because it's better
RUN npm i -g yarn
# install, copy, build frontend
RUN cd /home/node/ds-front && yarn
COPY ./ds-front /home/node/ds-front

# install, copy, build backend
RUN cd /home/node/ds-back && yarn
COPY ./ds-back /home/node/ds-back
RUN cd /home/node/ds-back && npm run build

FROM node:lts-alpine as prod-stage
# copy entrypoint
COPY ./entrypoint.sh /entrypoint.sh
# copy frontend to prod
COPY --from=build-stage /home/node/ds-front/ /ds-front/
# copy backend to prod
COPY --from=build-stage /home/node/ds-back/dist /ds-back/dist
COPY --from=build-stage /home/node/ds-back/node_modules /ds-back/node_modules
# install serve for frontend
RUN npm i -g serve
# expose ports and run servers
EXPOSE 8080 3000
CMD ["sh", "-c", "sh entrypoint.sh"]
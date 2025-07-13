FROM node:22.12.0-alpine AS build-stage
# make app directories
RUN mkdir /home/node/ds-front && mkdir /home/node/ds-back
# copy package.json files for install
COPY ./ds-front/package.json /home/node/ds-front
COPY ./ds-back/package.json /home/node/ds-back

# install, copy, build frontend
RUN cd /home/node/ds-front && yarn
COPY ./ds-front /home/node/ds-front

# install, copy, build backend
RUN cd /home/node/ds-back && yarn
COPY ./ds-back /home/node/ds-back
RUN cd /home/node/ds-back && yarn run build

FROM node:22.12.0-alpine AS prod-stage
# copy frontend to prod
COPY --from=build-stage /home/node/ds-front/ /ds-front/
# copy backend to prod
COPY --from=build-stage /home/node/ds-back/dist /ds-back/dist
COPY --from=build-stage /home/node/ds-back/node_modules /ds-back/node_modules
COPY ./entrypoint.sh /entrypoint.sh

# install nginx
RUN apk add --no-cache nginx

# expose ports and run servers
EXPOSE 81 3000
CMD ["sh", "-c", "sh entrypoint.sh"]
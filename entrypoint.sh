#!/bin/bash

yarn --cwd /ds-front run build
node /ds-back/dist/main & nginx -g 'daemon off;'
#!/bin/bash
cd /ds-front || exit
npm run build
serve -s dist -l 8080 \
& cd /paw_back && node dist/main
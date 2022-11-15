#!/bin/bash
cd /ds-front || exit
npm run build
serve -s dist -l 8080
cd /ds-back || exit
node dist/main
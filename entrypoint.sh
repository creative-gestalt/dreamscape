#!/bin/bash
cd /ds-front
npm run build
pm2 serve dist --port 8080 --name dreamscape
cd /ds-back
node dist/main
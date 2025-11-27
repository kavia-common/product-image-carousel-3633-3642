#!/bin/bash
cd /home/kavia/workspace/code-generation/product-image-carousel-3633-3642/frontend_carousel_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi


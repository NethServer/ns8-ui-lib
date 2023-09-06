#!/bin/bash

if [[ -z "$1" ]]; then
    echo "Missing parameter: append 'build' or 'publish'"
elif [[ "$1" = "build" ]]; then
    npm install && npm run build
elif [[ "$1" == "publish" ]]; then
    npm install && npm run build && npm publish
else
    echo "Parameter not recognized: '$1'. Only 'build' or 'publish' are allowed"
fi

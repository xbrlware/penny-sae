#!/bin/bash

COMPRESS=./compressJS.sh/compressjs.sh

$COMPRESS helpers.js *function.js ernest-scorer.js ernest.js
sudo cp ernest.js /srv/software/elasticsearch-2.2.1/config/scripts/ernest.js

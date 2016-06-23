#!/bin/bash

COMPRESS=./compressJS.sh/compressjs.sh

$COMPRESS helpers.js *function.js ernest-scorer.js ernest.js
sudo cp ernest.js /srv/software/elasticsearch-2.2.1/config/scripts/ernest.js

SCRIPT=$(cat ernest.js | sed 's/"/\\"/g')
curl -XPOST http://localhost:9205/_scripts/js/ernest -d  "{
     \"script\": \"$SCRIPT\"
}"

echo

curl -XPOST http://localhost:9205/_scripts/javascript/ernest -d  "{
     \"script\": \"$SCRIPT\"
}"

echo


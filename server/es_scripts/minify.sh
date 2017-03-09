#!/bin/bash

COMPRESS=./compressJS.sh/compressjs.sh

$COMPRESS helpers.js *function.js ernest-scorer.js ernest.js

SCRIPT=$(cat ernest.js | sed 's/"/\\"/g')
curl -XPOST http://localhost:9205/_scripts/js/ernest_v2 -d  "{
     \"script\": \"$SCRIPT\"
}"

echo

curl -XPOST http://localhost:9205/_scripts/javascript/ernest_v2 -d  "{
     \"script\": \"$SCRIPT\"
}"

echo


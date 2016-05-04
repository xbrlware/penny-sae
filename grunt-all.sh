#!/bin/bash

grunt devApp
grunt devLib
grunt css
grunt cmp

cd config
node configure.js
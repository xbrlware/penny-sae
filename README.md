# Penny: Suspicious Activity Explorer

## Data

Code to construct the Elasticsearch indices referenced by this app is contained in 

    https://github.com/gophronesis/ernest

## Front-end Quick Start

Assuming you have an Elasticsearch instance full of data:

```bash

# Install Dependencies
cd $PROJECT_ROOT
npm install

cd $PROJECT_ROOT/server/node
npm install

# Set up server configuration files (eventually turn into Grunt task)
cd $PROJECT_ROOT/config
node configure.js

# Compile static resources 
cd $PROJECT_ROOT
./grunt-all.sh

# Launch app!
cd $PROJECT_ROOT/server/node
node server.js

```

## Grunt Tasks

```
devApp - compiles the nodesec specific js into one file without uglifying it.

devLib - compiles all libraries (underscore, handlebars, etc.) into one file with uglifying it. It also runs the task cmp which compiles templates and adds them to the libs.js.

css    - compiles, minifies, and blesses all css files.
cmp    - compiles all handlebars files.

prodApp and prodLib do the same thing as devApp/devLib, but they also uglify the files. These have not been tested yet, so use at your own risk.

wth    - starts grunt-watch, but you must customize this to handle your tasks.
```

All file locations and variables available to grunt tasks are located in ./grunt.config.json.

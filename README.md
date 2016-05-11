# NODESEC

## Grunt

##### Registered Tasks
Configure the grunt tasks in Gruntfile.js.

devApp - compiles the nodesec specific js into one file without uglifying it.

devLib - compiles all libraries (underscore, handlebars, etc.) into one file with uglifying it. It also runs the task cmp which compiles templates and adds them to the libs.js.

css    - compiles, minifies, and blesses all css files.
cmp    - compiles all handlebars files.

prodApp and prodLib do the same thing as devApp/devLib, but they also uglify the files. These have not been tested yet, so use at your own risk.

wth    - starts grunt-watch, but you must customize this to handle your tasks.

All file locations and variables available to grunt tasks are located in ./grunt.config.json.

## Setup

After cloning the repository, run the following commands to get started.

```bash

# Install Dependencies
npm install
cd server/node
npm install
# Go back up to root directory

# Set up server configuration files, eventually turn into Grunt task
cd config
node configure.js

# TODO: Modify web/config/local-config.js or global-config.js with your 
elasticsearch credentials. Elasticsearch must be running for the app to work.
# Possibly throw error message to indicate that elasticsearch is down if user
# launches app without an ES instance to connect to.

# Go back up to root directory

# Launch app!
node server/node/server.js
# App is running at localhost:8090 or whichever port is specified by console

```

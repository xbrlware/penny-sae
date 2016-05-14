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

# Set up server configuration files (eventually turn into Grunt task)
cd config
node configure.js

# Connect Remote Port to your local port
# Run this from a directory with your PEM key.
ssh -I "yourkey.pem" -L 9205:localhost:9205 "IP address of elasticsearch instance"

# Go back up to app root directory

# Launch app!
cd server/node
node server.js
# App is running at localhost:8090 or whichever port is specified by console

```

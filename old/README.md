# Penny: Suspicious Activity Explorer

Web app for exploring suspicious activity in penny stocks.  Incorporates EDGAR, XBRL, message board, press release and tout data.

#### Quickstart
```bash
# Node dependencies
cd $PROJECT_ROOT/
npm install

cd $PROJECT_ROOT/server/node
npm install

# Configuration
cd $PROJECT_ROOT/config
node configure.js

# Grunt
cd $PROJECT_ROOT/
./grunt-all.sh

# Run server (make sure that Elasticsearch is visible!)
cd $PROJECT_ROOT/server/node
node server.js

# Navigate to localhost:8090

```

#### Grunt

Run `./grunt-all.sh` to run all `grunt` processes.
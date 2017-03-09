// server/node/server.js

var cluster = require('cluster');
var _ = require('underscore')._;

var logger = require('./logging');
logger.level = 'debug';

const MIN_VERSION = 1;
const MAJOR_VERSION = parseInt(process.version.replace('v', '').split('.')[0]);
if (MAJOR_VERSION < MIN_VERSION) {
  logger.debug('!! Major version of node.js is less than ', MIN_VERSION);
  logger.debug('!! You probably need to update.');
  process.exit();
}

function runServer () {
  var config = _.extend(require('./server-config'), require('./global-config'));
  var express = require('express');
  var https = require('https');
  var es = require('elasticsearch');
  var fs = require('fs');
  var app = express();
  var compression = require('compression');
  var bodyParser = require('body-parser');

  app.use(compression());
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

  // headers
  app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-Access-Token, Content-Type');
    res.header('Access-Control-Allow-Methods', 'POST, GET, DELETE');
    res.header('X-Content-Type-Options', 'nosniff');
    next();
  });

  app.set('jwtTokenSecret', 'noij123000acsn12sdfooncaio091r');

  require('./authentication/auth.js')(app, config);

  var client = new es.Client({
    hosts: config.ES.HOST,
    apiVersion: '2.2'
  });

  require('./routes')(app, config, client);
  require('./topic')(app, config, client);
  require('./network')(app, config, client);
  require('./boards')(app, config, client);

  app.use('/', express.static('../../dist'));

  if (config.HTTPS.ENABLED) {
    var privateKey = fs.readFileSync(config.HTTPS.CERTIFICATES.PEM, 'utf8');
    var certificate = fs.readFileSync(config.HTTPS.CERTIFICATES.CRT, 'utf8');
    var credentials = {key: privateKey, cert: certificate};

    https.createServer(credentials, app).listen(config.SERVER.PORT);
  } else {
    app.listen(config.SERVER.PORT);
  }

  logger.info('Nodesec | protocol = %s | port = %s', config.HTTPS.ENABLED ? 'https' : 'http', config.SERVER.PORT);
}

if (cluster.isMaster) {
  var cpuCount = Math.floor(require('os').cpus().length / 2) || 1;

  _.map(_.range(cpuCount), function (i) { cluster.fork(); });

  cluster.on('exit', function (worker) {
    logger.debug('Worker ' + worker.id + ' died');
    cluster.fork();
  });
} else {
  runServer();
}

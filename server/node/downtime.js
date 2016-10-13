// server/node/server.js

var _ = require('underscore');
var logger = require('./logging');
logger.level = 'debug';

const downtimeMsg = [
  'Penny is temporarily down for maintainance.',
  'We apologize for the inconvenience.',
  'Please contact ben at gophronesis dot com for questions or assistance.'
].join('<br><br>');

function runServer () {
  var config = _.extend(require('./server-config'), require('./global-config'));
  var express = require('express');

  var https = require('https');
  var fs = require('fs');
  var app = express();

  app.get('/', function (req, res) {
    logger.info('hit @ ' + Date.now());
    res.send(downtimeMsg);
  });

  if (config.HTTPS.ENABLED) {
    var privateKey = fs.readFileSync(config.HTTPS.CERTIFICATES.PEM, 'utf8');
    var certificate = fs.readFileSync(config.HTTPS.CERTIFICATES.CRT, 'utf8');
    var credentials = {key: privateKey, cert: certificate};

    https.createServer(credentials, app).listen(config.SERVER.PORT);
  } else {
    app.listen(config.SERVER.PORT);
  }

  logger.info('Downtime | protocol = %s | port = %s', config.HTTPS.ENABLED ? 'https' : 'http', config.SERVER.PORT);
}

runServer();

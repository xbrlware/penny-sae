// server/node/server.js

var _ = require('underscore');

const downtime_msg = [
  'Penny is temporarily down for maintainance.',
  'We apologize for the inconvenience.',
  'Please contact ben at gophronesis dot com for questions or assistance.'
].join('<br><br>');

function run_server () {
  var config = _.extend(require('./server-config'), require('./global-config'));
  var express = require('express'),

    https = require('https'),
    fs = require('fs'),
    app = express();

  app.get('/', function (req, res) {
    console.log('hit @ ' + Date.now());
    res.send(downtime_msg);
  });

  if (config.HTTPS.ENABLED) {
    var privateKey = fs.readFileSync(config.HTTPS.CERTIFICATES.PEM, 'utf8'),
      certificate = fs.readFileSync(config.HTTPS.CERTIFICATES.CRT, 'utf8'),
      credentials = {key: privateKey, cert: certificate};

    https.createServer(credentials, app).listen(config.SERVER.PORT);
  } else {
    app.listen(config.SERVER.PORT);
  }

  console.log('Downtime | protocol = %s | port = %s', config.HTTPS.ENABLED ? 'https' : 'http', config.SERVER.PORT);
}

run_server();

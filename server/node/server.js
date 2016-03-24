// server/node/server.js

// API for SEC Tool (2014-04-30)
// BKJ for Phronesis
// Propriety Code, may not be used w/o explicit permission of creators

// REST service, etc...
var cluster = require('cluster');
var _ = require('underscore')._;

function run_server() {
	var config  = require('./config.json');
	var express = require('express'),
       https  = require('https'),
          es  = require('elasticsearch'),
          fs  = require('fs'),
         app  = express();

  app.use(require('body-parser').json());

	// headers
	app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-Access-Token, Content-Type');
    res.header('Access-Control-Allow-Methods', 'POST, GET, DELETE');
    res.header('X-Content-Type-Options', 'nosniff');
    next();
  });

  if (config.CLEAR_USERS_ON_RESTART) {
    app.set('jwtTokenSecret', 'j89j9sdasdcbbopppaqwr23400' + new Date().toUTCString());
  } else {
    console.log('!!! not clearing current users !!!');
    app.set('jwtTokenSecret', 'noij123000acsn12sdfooncaio091r');
  } 
 
  require('./authentication/auth.js')(app, config);
	
  var client = new es.Client({hosts : [config.ES.HOST]});
  
  require('./routes')(app, config, client);
  
  app.use('/', express.static('../../web'));
  

  if (config.HTTPS.ENABLED) {
    var privateKey  = fs.readFileSync(config.HTTPS.CERTIFICATES.PEM, 'utf8'),
        certificate = fs.readFileSync(config.HTTPS.CERTIFICATES.CRT, 'utf8'),
        credentials = {key: privateKey, cert: certificate};

    https.createServer(credentials, app).listen(config.SERVER.PORT);
  } else {
      app.listen(config.SERVER.PORT);
  }
  
  console.log('Nodesec | protocol = %s | port = %s', config.HTTPS.ENABLED ? 'https' : 'http', config.SERVER.PORT);
}

if(cluster.isMaster) {
  var cpuCount = Math.floor(require('os').cpus().length / 2) || 1;
    
  _.map(_.range(cpuCount), function(i) { cluster.fork(); });

  cluster.on('exit', function(worker) {
    console.log('Worker ' + worker.id + ' died');
    cluster.fork();
  });
} else {
  run_server();
}

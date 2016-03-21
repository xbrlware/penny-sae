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

	// Basic Setup
	app.all('*', function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "X-Requested-With");
	  next();
	});

	var client = new es.Client({hosts : [config.ES.HOST]});

    app.use('/', express.static('../../web'));
    require('./routes')(app, config, client);

    if (config.HTTPS.ENABLED) {
      console.log(config.HTTPS.CERTIFICATES.PEM);
      console.log(config.HTTPS.CERTIFICATES.CRT);
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

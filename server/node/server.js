// API for SEC Tool (2014-04-30)
// BKJ for Phronesis
// Propriety Code, may not be used w/o explicit permission of creators

// REST service, etc...
var cluster = require('cluster');
var _ = require('underscore')._;

function run_server() {
	var config = require('../server_config');

	var express  = require('express'),
         es      = require('elasticsearch'),
         app     = express();
    
//         url     = require('url'),
//         qs      = require('querystring'),
//         util    = require('util'),
//         async   = require('async'),
//         request = require('request'),
//         _s      = require('underscore.string');

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
    
    app.listen(config.SERVER.PORT);
    console.log('NODESEC API :: ', config.SERVER.PORT);
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

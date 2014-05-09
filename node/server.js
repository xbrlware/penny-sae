// API for SEC Tool (2014-04-30)
// BKJ for Phronesis
// Propriety Code, may not be used w/o explicit permission of creators

var es      = require('elasticsearch');
var client  = new es.Client();
var express = require('express');
var app     = express();
var url     = require('url');
var qs      = require('querystring');
var util    = require('util');

var qp = require('./qp.js');
var sg = require('./sar_generator.js');

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/', function(req, res) {
    client.count(function (error, response, status) {
        var count = response.count;
        res.send('cluster is up, with ' + count + 'entries')
    });
});


app.post('/fetch_companies', function(req, res) {
    d = ''
    req.on('data', function(data) { d += data; });
    req.on('end', function() {
        try{
            d     = JSON.parse(d);
//            index = d.index;
//            query_type = d.query_type;
//            query_args = d.query_args;
//            from  = d.from == undefined ? 0 : d.from;
//            console.log('index', index)
//            console.log('query_type', query_type)
//            console.log('query_args', query_args)
//            console.log('from',  from)

            var body = qp.parse(d.query_type, d.query_args);
            client.search({
              index : d.index,
              body  : body,
              from  : d.from == undefined ? 0 : d.from,
            }).then(function (es_response) {
                res.send(es_response);
            });
        }
        catch (e) {
          console.log("catching parse error...");
          console.log(e);
        }
    });
});

app.post('/sar_generator', function(req, res) {
    d = ''
    req.on('data', function(data) {
        d += data;
    });
    req.on('end', function() {
        try{
            d = JSON.parse(d);
            
            var company_body = qp.parse('cikQuery', [d.cik])
            client.search({
                index : 'companies',
                body  : company_body,
                from  : 0
            }).then(function(comp) {
                var network_body = qp.parse('networkQuery_center', [d.cik]);
                client.search({
                  index : 'network',
                  body  : network_body,
                  from  : 0,
                }).then(function (net) {
                    res.send(sg.writeReport(comp, net));
                });
            });
        }
        catch (e) {
          console.log("catching parse error...");
          console.log(e);
        }
    });
});


app.listen(8080);
console.log('SEC API --- 8080');


// API for SEC Tool (2014-04-30)
// BKJ for Phronesis
// Propriety Code, may not be used w/o explicit permission of creators

// REST service, etc...
var cluster = require('cluster');


function run_server() {
	var config = require('../server_config.js');

	var express  = require('express'),
         es      = require('elasticsearch'),
         app     = express(),
         url     = require('url'),
         qs      = require('querystring'),
         util    = require('util'),
         async   = require('async'),
         request = require('request'),
         _       = require('underscore'),
         _s      = require('underscore.string');

    app.use(require('body-parser').json());

	// Elasticsearch clients
	var client     = new es.Client({hosts : [config.ES_HOST]});
	var cs_client  = new es.Client({hosts : [config.AUX_HOST]});

	// Import scripts
	var qp = require('./qp.js');
	var sg = require('./sar_generator.js');

	// Basic Setup
	app.all('*', function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "X-Requested-With");
	  next();
	});

    app.use('/', express.static('../../web'));

    function sort_decreasing(a,b){
        if (a[1] < b[1]) return 1;
        if (a[1] > b[1]) return -1;
        return 0;
    }

    function setRedFlags(rf_clean, f) {

        var out = new Object;

        out.delta_redflag         = false;
        out.financials_redflag    = false;
        out.trading_halts_redflag = false;
        out.delinquency_redflag   = false;
        out.network_redflag       = false;

        out.delta_value         = false;
        out.financials_value    = false;
        out.trading_halts_value = false;
        out.delinquency_value   = false;
        out.network_value       = false;

        if(f.delta != undefined) {
            out.have_delta = true;
            out.delta_value   = f.delta[0].nchange;
            out.delta_redflag = f.delta[0].nchange >= rf_clean.delta.thresh;
        }
        if(f.financials_scriptfield != undefined) {
            out.have_financials = true;
            out.financials_value   = f.financials_scriptfield[0];
            out.financials_redflag = f.financials_scriptfield[0] > 0;
        }
        if(f.trading_halts != undefined) {
            out.have_trading_halts = true;
            out.trading_halts_value   = f.trading_halts[0];
            out.trading_halts_redflag = f.trading_halts[0] > 0;
        }
        if(f.delinquency_scriptfield != undefined) {
            out.have_delinquency    = true;
            out.delinquency_value   = f.delinquency_scriptfield[0];
            out.delinquency_redflag = f.delinquency_scriptfield[0] >= rf_clean.delinquency.thresh;
        }
        if(f.network_scriptfield != undefined) {
            out.have_network    = true;
            out.network_value   = f.network_scriptfield[0];
            out.network_redflag = f.network_scriptfield[0] > rf_clean.network.thresh;
        }
        if(f.crowdsar_scriptfield != undefined){
            out.have_crowdsar     = true;
            out.crowdsar_value    = f.crowdsar_scriptfield[0];
            out.crowdsar_redflag  = f.crowdsar_scriptfield[0] > 0;
        }
        if(f.pv_scriptfield != undefined) {
            out.have_pv   = true;
            if(Object.keys(f.pv_scriptfield[0]).length > 0){
                out.pv_value   = f.pv_scriptfield[0].condition_met.length;
                out.pv_redflag = f.pv_scriptfield[0].condition_met.length > 0;
            }
        }
        
        out.total    = out.delta_redflag + out.financials_redflag + out.trading_halts_redflag +
                        out.delinquency_redflag + out.network_redflag;
        out.possible = rf_clean.toggles.delta + rf_clean.toggles.financials + rf_clean.toggles.trading_halts +
                        rf_clean.toggles.delinquency + rf_clean.toggles.network;
        return out;
    };


    if(config.TTS_TYPE == 'js') {
        app.post('/fetch_tts', function(req, res) {
            var d = req.body;
           
            var body = qp.parse('ttsQuery', d.query_args, undefined)
            cs_client.search({
                index : "omx",
                body  : body
            }).then(function(es_response) {
                var buckets = es_response.aggregations.searchTerm_filt.searchTerm_dh.buckets;
                res.send(buckets);
            });
        })
//    } else if(config.TTS_TYPE == 'r'){
//        app.post('/fetch_tts', function(req, res) {
//            var d = req.body;
//            postfields = {"json" : {
//                            "fun" : "term_prevelance",
//                            "params" : {
//                                "search_terms" : d.query_args.searchTerm
//                            }
//                         }};
//            console.log('about to post')
//            request.post(
//                'http://0.0.0.0:9090/',
//                postfields,
//                function (error, response, body) {
//                    console.log('error', error);
//                    console.log('response', response);
//                    console.log('body', body);
//                    
//                    body = JSON.parse(body);
//                    res.send(body);
//                }
//            );
//        })
    } else {
        console.log('illegal TTS_TYPE!');
    }

    function topic_summary_statistics(data, rf_clean, callback) {
        console.log('------- topic summary statistics', rf_clean)
        hits = data.hits.hits;

        rf_total    = 0;
        rf_possible = 0;
        rf_any      = 0;
        count       = 0;
        
        agg         = new Object();
        cd_set      = new Object()
        cd_last_set = new Object()

        hits.map(function(x) {
        
            if(x.fields != undefined) {
                var rf = setRedFlags(rf_clean, x.fields)
                Object.keys(rf).map(function(k) {
                    if(k in agg) {
                        agg[k] += rf[k];
                    } else {
                        agg[k] = rf[k];
                    }
                });
                 
                rf_total    += rf.total
                rf_possible += rf.possible
                if(rf.total > 0) rf_any++
                count++;
            }
            
            var cd = x._source.company_data;
            if(cd != undefined) {
                if(cd.sic != undefined) {
                    // All previous SIC
                    cd.sic.map(function(c) {
                        if(c in cd_set) {
                            cd_set[c]++
                        } else {
                            cd_set[c] = 1;
                        }
                    });
                 
                    // Current SIC
                    cd_last = cd.sic[cd.sic.length - 1]
                    if(cd_last in cd_last_set) {
                        cd_last_set[cd_last]++
                    } else {
                        cd_last_set[cd_last] = 1;
                    }
                }
            }
        });

        agg2 = []
        Object.keys(agg).map(function(k) {  agg2.push([k, agg[k]])  });

        cd_last_set2 = []
        Object.keys(cd_last_set).map(function(k) {  cd_last_set2.push([k, cd_last_set[k]])  });

        agg2         = agg2.sort(sort_decreasing);
        cd_last_set2 = cd_last_set2.sort(sort_decreasing);
        
        data.tss = {"agg" : agg2, "cd" : cd_set, "cd_last" : cd_last_set2,
                    "rf_total" : rf_total, "rf_possible" : rf_possible,
                    "count" : count, "rf_any" : rf_any}
        callback(data)
    }


    app.post('/fetch_companies', function(req, res) {
        var d = req.body;
        var search_params = {
            body : qp.parse(d.query_type, d.query_args, d.rf),
            from : d.from == undefined ? 0 : d.from
        }
        console.log('body', JSON.stringify(search_params['body']));
       
        if(d.index != config.NETWORK_INDEX && d.index != 'network') {
            search_params['index'] = d.index;
        } else {
            search_params['index'] = [config.NETWORK_INDEX, config.COMPANY_INDEX];
        }

        client.search(
            search_params
        ).then(function (es_response) {
            console.log(es_response);
            res.send(es_response);
        });
    });

    app.post('/fetch_topic', function(req, res) {
        var d = req.body;
        var body = qp.parse(d.query_type, d.query_args, d.rf);
        cs_client.search({
            body  : body,
            from  : 0,
        }).then(function (es_response) {
            console.log('process_topic_request', es_response);
            
            var buckets = es_response.aggregations.trending.buckets;
            if(buckets != undefined) {
                var ciks = _.pluck(buckets, 'key')
            };
            
            client.search({
                index : config.COMPANY_INDEX,
                body  : qp.parse('multiCIKQuery', {"ciks" : ciks}, d.rf) // ----> Add aggregations here
            }).then(function(es_response2) {
            
                var hits = es_response2.hits.hits;
                var arr2 = [];
                for(i=0; i < ciks.length; i++) {
                    mtc = hits.filter(function(x) {return x['_id'] == parseInt(ciks[i], 10)});
                    if(mtc.length > 0) {
                        arr2.push(mtc[0]);
                    }
                };
                
                console.log('calling topic summary statistics')
                topic_summary_statistics(es_response2, d.rf, function(out) {
                    out.hits.hits = arr2.slice(1, 15);
                    out.total_hits_topic = ciks.length;
                    console.log(es_response.aggregations.cik_filter.trending_names.buckets);
                    out.names = es_response.aggregations.cik_filter.trending_names.buckets;
                    res.send(out);
                });
            })
        });
    });

    // Named Entity Recognition Page
    app.post('/fetch_ner', function(req, res) {
        var d = req.body;
        client.get({
            index : "ner",
            type  : "cik",
            id    : d.cik
        }).then(function (es_response) {
            tmp = _.map(es_response._source.ner, function(x) {
                if(x.hidden == undefined) {
                    x.hidden = false;
                }
                if(x.hidden && !d.show_hidden) {
                    return undefined
                } else {
                    return {
                        name      : x.name[0],
                        cnt_total : x.cnt_total[0],
                        occ_total : x.occ_total[0],
                        records   : x.records,
                        hidden    : x.hidden
                    }
                }
            });
            tmp = _.filter(tmp, function(x) {return x != undefined});
            tmp = _.sortBy(tmp, function(x) {return x.cnt_total});
            tmp.reverse();
            
            
            res.send(tmp);
        }, function(error) {
            res.send([undefined]);
        })
    });

    app.post('/set_ner', function(req, res) {
        var d = req.body;
        client.get({
            index : config.NETWORK_INDEX,
            type  : "actor",
            id    : d.cik
        }).then(function (orig) {
            
            _.map(orig._source.adjacencies, function(orig_adj) {
                var update = _.where(d.updates, {"nodeTo" : orig_adj.nodeTo})[0];
                console.log('update', update);
// I don't know exactly why this error would get thrown...
                if(update != undefined) {
                    console.log('update.hidden', update.hidden);
                    orig_adj.data.hidden = update.hidden;
                } else {
                    orig_adj.data.hidden = true;
                }
            });

            console.log('orig_adj', orig._source.adjacencies);
            
            client.index({
              index : config.NETWORK_INDEX,
              type  : 'actor',
              id    : d.cik,
              body  : orig._source
            }).then(function(resp) {
                console.log(resp);
                res.send(resp);
            });
        });
    });


    // Sar Generator
    app.post('/sar_generator', function(req, res) {
        var d = req.body;
        var company_body = qp.parse('cikQuery', {"cik" : d.cik}, d.rf)
        client.search({
            index : config.COMPANY_INDEX,
            body  : company_body,
            from  : 0
        }).then(function(comp) {
            var network_body = qp.parse('networkQuery_center', {"cik" : d.cik}, d.rf);
            client.search({
              index : config.NETWORK_INDEX,
              body  : network_body,
              from  : 0,
            }).then(function (net) {
                res.send(sg.writeReport(comp, net));
            });
        });
    });


    app.post('/red_flag_individuals', function(req, res) {
        var d = req.body;
        all_ciks = d.query_args.all_ciks;
       
        function calculate_rf_individual(cik, callback) {
            // Get companies that individual is connected to
            console.log('>>> cik', cik);
            var rf_total, rf_possible, n_ass, rf_score;
            client.search({
              index : config.NETWORK_INDEX,
              body  : qp.parse('networkQuery_center', {"cik" : cik}, d.rf),
              from  : 0,
            }).then(function(data) {
                var adj = data.hits.hits[0]._source.adjacencies;

                var nodeTos = _.pluck(adj, 'nodeTo');
                console.log('nodeTos', nodeTos);
                client.search({
                    index : config.COMPANY_INDEX,
                    body  : qp.parse('multiCIKQuery', {"ciks": nodeTos}, d.rf),
                    from  : 0
                }).then(function(company_data) {
                    console.log('got company data', company_data);
                    var company_data = company_data.hits.hits;
                    rf_total    = 0;
                    rf_possible = 0;
                    n_ass       = 0;
                    company_data.map(function(x) {
                        var rf       = setRedFlags(d.rf, x.fields)
                        rf_total    += rf.total
                        rf_possible += rf.possible
                        n_ass++
                    });
                    
                    rf_score = rf_possible > 0 ? Math.round(100 * rf_total / n_ass) / 100 : -1;
                    rf_score = isNaN(rf_score) ? 0 : rf_score;
                    
                }).then(function() {
                    callback(null, {"cik" : cik, "avg" : rf_score, "total" : rf_total, "possible" : rf_possible, "n_ass" : n_ass});
                })
            })
        };
       
        async.map(all_ciks, calculate_rf_individual, function(err, results) {
            console.log(results);
            res.send(results);
        });
    });
	
    
    app.post('/search_omx', function(req, res) {
        var d = req.body;
        cs_client.search({
            "index" : "omx",
            "type"  : "release",
            "body"  : {
                "query" : {
                    "match" : {
                        "cik" : _s.pad(d.cik, 10, '0')
                    }
                },
                "sort": [
                    {
                        "time": {
                            "order": "desc"
                        }
                    }
                ],
                "size" : 100
            }
        }).then(function(response) {
            console.log('response', response);
            res.send(
                _.map(response.hits.hits, function(hit) {
                    var src = hit._source;
                    src._id = hit._id;
                    return src;
                })
            );
        });
    });
    
    app.post('/fetch_omx', function(req, res) {
        var d = req.body;
        cs_client.get({
            "index" : "omx",
            "type"  : "release",
            "id"    : d.omx_id
        }).then(function(response) {
            res.send(response._source);
        });
    });

    app.post('/fetch_leadership', function(req, res) {
        var d = req.body;
        var flatten_obj = function(x, result, prefix) {
            if(_.isObject(x)) {
                _.each(x, function(v, k) {
                    flatten_obj(v, result, prefix ? prefix + '_' + k : k)
                })
            } else {
                result[prefix] = x
            }
            return result
        }
       
        cs_client.search({
            "index" : "forms",
            "type"  : "4",
            "body"  : {
              "_source" : ["ownershipDocument.reportingOwner.reportingOwnerRelationship",
                            "ownershipDocument.periodOfReport",
                            "ownershipDocument.reportingOwner.reportingOwnerId"],
              "size": 999999,
              "query": {
                "match": {
                  "ownershipDocument.issuer.issuerCik": _s.pad(d.cik, 10, '0')
                }
              }
            }
        }).then(function(response) {
            var hits = response.hits.hits;

            var src = _.chain(hits)
            .pluck('_source')
            .pluck('ownershipDocument')
            .map(function(x) {
                if(x.reportingOwner.length == undefined) {
                    x.reportingOwner = [x.reportingOwner]
                }
                _.map(x.reportingOwner, function(y) {
                    y.periodOfReport = x.periodOfReport;
                })
                return x
            })
            .pluck('reportingOwner')
            .flatten()
            .map(function(x) {return flatten_obj(x, {})})
            .groupBy('reportingOwnerId_rptOwnerCik')
            .value()

            var poses = ['reportingOwnerRelationship_isDirector',
                         'reportingOwnerRelationship_isOfficer',
                         'reportingOwnerRelationship_isTenPercentOwner',
                         'reportingOwnerRelationship_isOther']
            var dates = _.chain(_.values(src))
                .map(function(x) {
                    var out = {
                        'name' : x[0]['reportingOwnerId_rptOwnerName'],
                        'cik'  : x[0]['reportingOwnerId_rptOwnerCik']
                    }
                    
                    function get_pos(pos, out) {
                     
                        var dates = _.chain(x)
                         .filter(function(y) {return y[pos] == '1'})
                         .pluck('periodOfReport')
                         .value()
                     
                        var max = _.max(dates, function(d) {return new Date(d)});
                        var min = _.min(dates, function(d) {return new Date(d)});
                        if(max != -Infinity) {
                            out[pos] = {
                                "start" : min,
                                "stop"  : max
                            }
                        }
                        return out
                    }
                    
                    _.map(poses, function(pos) {
                        out = get_pos(pos, out);
                    });
                    return out;
                }).value();
            console.log('leadership respones --------------------- ', JSON.stringify(dates));
            res.send({"dates" : dates, "posNames" : poses});
        });
    });
    
    app.listen(config.NODE_PORT);
    console.log('NODESEC API --- ' + config.NODE_PORT);
}

if(cluster.isMaster) {
    var cpuCount = Math.floor(require('os').cpus().length / 2);
    var cpuCount = cpuCount || 1;
    
    for (var i = 0; i < cpuCount; i += 1) {
            cluster.fork();
    }
    cluster.on('exit', function (worker) {
        console.log('Worker ' + worker.id + ' died');
        cluster.fork();
    });
} else {
    run_server();
}

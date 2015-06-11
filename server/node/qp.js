// Query Parser -- write Elasticsearch queries

var bunyan = require('bunyan'),
        _  = require('underscore')._;

var b = new bunyan({'name' : 'nodesec-query-parser', 'level' : 'debug'});

var SIZE = 15;
var CURRENT_NAME_QUERY =  {"script" : "if(_source.company_data != null) { \n\
                                            if(_source.company_data.company_name != null) { \n\
                                                _source.company_data.company_name[_source.company_data.company_name.length-1] \n\
                                            } else { \n\
                                                null; \n\
                                            } \n\
                                        } else {\n\
                                            null;\n\
                                        }",
                           "lang"   : "javascript"}
var LENGTH_QUERY = {"script" : "if(doc['company_data.date'].values != null) {\n\
                                    doc['company_data.date'].values.length \n\
                                } else { \n\
                                    null; \n\
                                }",
                    "lang"   : "javascript"}
var NULL_QUERY = {
    "query": {
        "match_all": {}
    },
    "script_fields": {
        "n_records"   : LENGTH_QUERY,
        "currentName" : CURRENT_NAME_QUERY
    },
    "size": SIZE
};

CONSTANT_BOOST = 1000;

/* --------------------- Functions for Filtering + Scoring  ---------------------- */
function setFunctions(rf){
    var func = [];
  
    // Whether changes exceed threshold
    if(rf.toggles.delta){
        var delta   = rf.delta;
        func.push({
            "script_score" : {
                "script": "delta_score",
                "params": {
                    "type"   : delta.type,
                    "thresh" : parseInt(delta.thresh, 10)
                }}
        });
    }
    
    // Presence of trading halts
    if(rf.toggles.trading_halts) {
        func.push({
            "script_score" : {
                "script": "trading_halt_score"
            }
        });
    }

    // Number of years below threshold
    if(rf.toggles.financials){
        var financials = rf.financials;
        func.push({
            "script_score" : {
              "script" : "financials_score",
              "params" : {
                "type"         : financials.type,
                "below"        : parseFloat(financials.below),
                "below_for"    : parseFloat(financials.below_for),
                "contemporary" : financials.contemporary
              }}
        });
    }

    // Number/proportion of suspicious posts
    if(rf.toggles.crowdsar){
        var crowdsar = rf.crowdsar;
        func.push({
            "script_score" : {
              "script" : "crowdsar_score",
              "params" : {
                "type"        : crowdsar.type,
                "past_months" : parseInt(crowdsar.past_months, 10)
              }}
        });
    }

    if(rf.toggles.tout){
        var tout = rf.tout;
        func.push({
            "script_score" : {
              "script" : "tout_score",
              "params" : {
                "type"        : tout.type,
                "past_months" : parseInt(tout.past_months, 10)
              }}
        });
    }

    if(rf.toggles.pv) {
        var pv      = rf.pv;
        func.push({
            "script_score" : {
                "script": "pv_score",
                "params": {
                    "price_jump"        : parseFloat(pv.price_jump) / 100 + 1, // Converts 0% jump to 100% of last days price
                    "volume_window"     : parseFloat(pv.volume_window),
                    "volume_multiplier" : parseFloat(pv.volume_multiplier),
                    "fall_within"       : parseFloat(pv.fall_within),
                    "fall_to"           : parseFloat(pv.fall_to) / 100
                }}
        });
    };

    if(rf.toggles.delinquency) {
        var delinquency      = rf.delinquency;
        func.push({
            "script_score" : {
                "script": "delinquency_score",
                "params": {
                    "since"  : delinquency.since,
                    "thresh" : delinquency.thresh
                }}
        });
    };

    if(rf.toggles.network){
        var network = rf.network;
        func.push({
            "script_score" : {
                "script" : "otc_ass_score",
                "params" : {
                    "type"   : network.type,
                    "thresh" : parseFloat(network.thresh)
                }
            }
        });
    }

    if(func.length > 0) {
        return func;
    } else {
        return undefined;
    }
};

/* Functions for Script Return */
function setScriptFields(rf, include_generic){

    include_generic = include_generic == undefined ? true : include_generic;
    var sf         = new Object;
    if(include_generic) {
        sf.n_records   = LENGTH_QUERY;
        sf.currentName = CURRENT_NAME_QUERY;
    }
    if(rf == undefined)
        return sf;

    // Number of changes in business metadata
    if(rf.toggles.delta) {
        var delta = rf.delta;
        if(delta.type != undefined){
            sf.delta = {
                "script": "delta",
                "params": {
                    "type" : delta.type
                }
            }
        }
    };

    // Number of trading halts
    if(rf.toggles.trading_halts) {
        sf.trading_halts = {
            "script" : "trading_halt_scriptfield"
        }
    };
  
    // Number of filings with revenues below threshold
    if(rf.toggles.financials){
        var financials = rf.financials;
        sf.financials_scriptfield = {
            "script" : "financials_scriptfield",
            "params" : {
                "type"         : financials.type,
                "below"        : parseFloat(financials.below),
                "below_for"    : parseFloat(financials.below_for),
                "contemporary" : financials.contemporary
            }
        }
    };
    
    // Number/proportion of suspicious posts
    if(rf.toggles.crowdsar){
        var crowdsar = rf.crowdsar;
        sf.crowdsar_scriptfield = {
          "script" : "crowdsar_scriptfield",
          "params" : {
            "type"        : crowdsar.type,
            "past_months" : parseInt(crowdsar.past_months, 10)
          }
        };
    };

    // Number/proportion of suspicious posts
    if(rf.toggles.tout){
        var tout = rf.tout;
        sf.tout_scriptfield = {
          "script" : "tout_scriptfield",
          "params" : {
            "type"        : tout.type,
            "past_months" : parseInt(tout.past_months, 10)
          }
        };
    };

    // Price/volume anomalies
    if(rf.toggles.pv){
        var pv      = rf.pv;
        sf.pv_scriptfield = {
            "script": "pv_scriptfield",
            "params": {
                  "price_jump"        : parseFloat(pv.price_jump) / 100 + 1, // Converts 0% jump to 100% of last days price
                  "volume_window"     : parseFloat(pv.volume_window),
                  "volume_multiplier" : parseFloat(pv.volume_multiplier),
                  "fall_within"       : parseFloat(pv.fall_within),
                  "fall_to"           : parseFloat(pv.fall_to) / 100
            }}
    };
    
    // Late filings
    if(rf.toggles.delinquency) {
        var delinquency      = rf.delinquency;
        sf.delinquency_scriptfield = {
                "script": "delinquency_scriptfield",
                "params": {
                    "since"  : delinquency.since,
                    "thresh" : delinquency.thresh
                }}
    };

    // OTC Neighbors
    if(rf.toggles.network){
        var network = rf.network;
        sf.network_scriptfield = {
            "script" : "otc_ass_scriptfield",
            "params" : {
                "type" : network.type
            }
        }
    };

    return sf;
}

function rfFilterQuery(rf) {
    var parsed        = new Object;
    parsed.min_score  = CONSTANT_BOOST * (rf.toggles.delta + rf.toggles.financials + rf.toggles.network +
                        rf.toggles.trading_halts + rf.toggles.delinquency);
    parsed.query      = new Object;
        parsed.query.function_score = new Object;
            parsed.query.function_score.query      = {"match_all" : {}},
            parsed.query.function_score.score_mode = "sum";
            parsed.query.function_score.functions  = setFunctions(rf);
    parsed.fields        = ["_source"];
    parsed.script_fields = setScriptFields(rf);
    parsed.size          = SIZE;
    b.debug(parsed);
    return parsed;
};

/* Query for Detail Page */
function detailQuery(cik, rf) {
    var parsed = new Object;
    parsed.query = {
        "multi_match" : {
            "query"  : cik,
            "fields" : ["_id", "cik"]
        }};
    parsed.fields        = ["_source"];
    parsed.script_fields = setScriptFields(rf);
    return parsed;
}

/* Query for Search Function */

function companyQuery(name, rf) {
    var parsed       = new Object;
    parsed.min_score = .001         // Relevance to search term
    if(name != undefined){
        parsed.query = {
            "multi_match" : {
                "query"    : name,
                "operator" : "and",
                "fields"   : ["company_name",
                                "cik",
                                "irs",
                                "sic",
                                "_id",
                                "ticker"]
            }
        }
    } else {
        parsed.query = {"match_all" : {}};
    }
    parsed.fields        = ["_source"];
    parsed.script_fields = setScriptFields(rf);
    parsed.size          = SIZE;
    
    return parsed;
};

function topicQuery(topic, rf) {
    var parsed   = new Object;
    parsed.query = {
        "bool": {
          "should": [
            { "match": { "msg": topic }},
            { "match": { "body": topic }}
          ],
          "minimum_should_match": 1
        }
      }
    parsed.size = 0;
    parsed.aggs = {"trending" : {   // This gives number of documents, so it's driven by CROWDSAR
                        "terms" : {
                            "field" : "cik",
                            "size" : 99999,
                            "min_doc_count" : 1
                        }
                    },
                    "cik_filter" : {
                        "filter" : {"missing" : {"field" : "cik"}},
                        "aggs" : {
                            "trending_names" : {
                                "terms" : {
                                    "script" : "_source['name']",
                                    "size" : 99999,
                                    "min_doc_count" : 1
                                }
                            }
                        }
                    }
                }
    console.log(parsed);
    return parsed;
};

/* Misc Company Queries  ------------------------ */
function currentQuery(ciks, rf) {
    var parsed = new Object;
    parsed.query =  {
            "terms": {
                "cik" : ciks }
            }
    parsed.size = 9999;
    return parsed;
}

function cikQuery(cik) {
    return {
        "query": {
            "match": {
                "_id" : parseInt(cik, 10) }}}
}

/* Network Queries ------------------------------ */
function networkQuery_center(narg, rf) {
    if(narg.id != undefined) {
        var cik = narg.id;
        narg.setData('explored', true);
    } else {
        var cik = narg;
    }

    var parsed = new Object;
    parsed.query = { "multi_match": {
                            "query" : cik,
                            "fields" : ["_id", "id", "cik"]
                        }
                    }
    parsed.fields = ["_source"];
    parsed.script_fields = setScriptFields(rf, false);
    parsed.size = 9999
    return parsed;
}


function smart_parseInt(x) {
    var x_asint = parseInt(x, 10);
    if(!isNaN(x_asint)) {
        return x_asint
    } else {
        return x
    }
}

function networkQuery_neighbors(neibs, rf){

    var ids = _.map(neibs, function(neib) {
        return smart_parseInt(neib.nodeTo);
    });
    
    var parsed = {
        "_source" : ["id", "name", "name_id", "data"],
        "query" : {
            "ids": {
                "values" : ids
            }
        },
        "script_fields" : setScriptFields(rf, false),
        "size"          : 9999
    }
    
    return parsed;
}

function networkQuery_adjacencies(ids, rf){
    var parsed = {
        "fields" : ["_source"],
        "query" : {
            "ids": {
                "values" : ids
            }
        },
        "script_fields" : setScriptFields(rf, false),
        "size"          : 9999
    }
    
    return parsed;
}

function multiCIKQuery(ciks, rf){

    var ids = _.map(ciks, smart_parseInt);
    console.log('multiCIKQuery ids', ids);
    
    var parsed = new Object;
    parsed.query = {
            "ids": {
                "values" : ids
            }
        }
    parsed.fields        = ["_source"];
    parsed.script_fields = setScriptFields(rf);
    parsed.size          = 9999
    return parsed;
}

function ttsQuery(searchTerm) {
    var parsed   = new Object;
    parsed.query = {"match_all" : {}};
    parsed.size = 0;
    parsed.aggs = {"searchTerm_filt" : {   // This gives number of documents, so it's driven by CROWDSAR
                        "filter" : { "term" : {"body" : searchTerm} },
                        "aggs" : {
                            "searchTerm_dh" : {
                                "date_histogram" : {
                                    "field"    : "time",
                                    "interval" : "week"
                                }
                            }
                        }
                    }
                }
    console.log(parsed);
    return parsed;
}

/* Server Interface */
exports.parse = function(type, args, rf) {
//    b.debug(type, 'type');
//    b.debug(args, 'args');
//    b.debug(rf, 'rf');
    
    switch(type) {


        /* Searches */
        case 'companyQuery':
            return companyQuery(args.searchTerm, rf);
        case 'topicQuery':
            return topicQuery(args.searchTerm, rf);
        case 'rfFilterQuery':
            return rfFilterQuery(rf);

        /* Detail Page */
        case 'detailQuery':
            return detailQuery(args.cik, rf);

        case 'multiCIKQuery':
            return multiCIKQuery(args.ciks, rf);
            
        case 'cikQuery':
            return cikQuery(args.cik);
        case 'resultsQuery':
            return resultsQuery(args.q);

        /* Network */
        case 'currentQuery':
            return currentQuery(args.id, rf);
        case 'networkQuery_center':
            return networkQuery_center(args.cik, rf);
        case 'networkQuery_neighbors':
            return networkQuery_neighbors(args.adj, rf);
        case 'networkQuery_adjacencies':
            return networkQuery_adjacencies(args.all_ciks, rf);

        /*  */
        case 'ttsQuery':
            return ttsQuery(args.searchTerm);

        default:
            console.log('unsupported query:', type)
            return undefined;
    }
}

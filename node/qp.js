var SIZE = 25;

var NULL_QUERY = {
    "query": {
        "match_all": {}
    },
    "script_fields": {
        "n_records" : {
            "script": "doc['company_data.date'].values.length",
            "lang": "javascript"
        },
        "currentName": {
            "script": "_source.company_data.company_name[_source.company_data.company_name.length-1]",
            "lang": "javascript"
        }
    },
    "size": SIZE
};

var SPLASH_QUERY_RISK = {
    "query": {
        "match_all": {}
    },
    "sort": {
        "risk.risk_score": {"order": "desc"}
    },
    "fields" : [
        "_source"
    ],
    "script_fields" : {
        "currentName": {
            "script": "_source.company_data.company_name[_source.company_data.company_name.length-1]",
            "lang": "javascript"
        }
    },
    "size" : SIZE
};

var SPLASH_QUERY_VOLUME = {
    "query": {
        "match_all": {}
    },
    "sort": {
        "curr_vmult.curr_vmult": {"order": "desc"}
    },
    "fields" : [
        "_source"
    ],
    "script_fields" : {
        "currentName": {
            "script": "_source.company_data.company_name[_source.company_data.company_name.length-1]",
            "lang": "javascript"
        }
    },
    "size" : SIZE
};


function setFunctionScoreQuery(name) {
    if(name != undefined){
        var quer = {
            "multi_match" : {
                "query" : name.value.name,
                "fields" : ["company_name", "cik", "irs", "sic", "_id", "ticker"]
            }}
    } else {
        var quer = {"match_all" : {}};
    }
    return quer;
};

function setFunctions(pv, delta){
    if(delta == undefined && pv == undefined)
        return undefined

    var func = [];
    if(delta != undefined){
        func.push({
            "script_score" : {
                "script": "delta_score",
                "params": {
                    "type": delta.value.field,
                    "thresh": delta.value.thresh
                }}
        })
    }
    if(pv != undefined) {
        func.push({
            "script_score" : {
                "script": "pv_score",
                "params": {
                    "price_jump"        : pv.value.price_jump / 100,
                    "volume_window"     : pv.value.volume_window,
                    "volume_multiplier" : pv.value.volume_multiplier,
                    "fall_within"       : pv.value.fall_within,
                    "fall_to"           : pv.value.fall_to / 100
                }}
        })
    };
    return func;
};

function setScriptFields(pv, delta){
    var sf = new Object;
    sf.n_records   = {"script" : "doc['company_data.date'].values.length",
                      "lang"   : "javascript"}
    sf.currentName = {"script" : "_source.company_data.company_name[_source.company_data.company_name.length-1]",
                      "lang"   : "javascript"}
    
    if(delta != undefined){
        sf.delta = {
            "script": "delta",
            "params": {
                "type" : delta.value.field
            }}
    }
    if(pv != undefined) {
        sf.spike = {
            "script": "pv",
            "params": {
                "price_jump"       : pv.value.price_jump,
                "volume_window"    : pv.value.volume_window,
                "volume_multiplier": pv.value.volume_multiplier,
                "fall_within"      : pv.value.fall_within,
                "fall_to"          : pv.value.fall_to
            }}
    }
    
    return sf;
}


function splashQuery(splashType) {
    if(splashType == 'risk') {
        return SPLASH_QUERY_RISK;
    } else if(splashType == 'volume') {
        return SPLASH_QUERY_VOLUME;
    } else {
        console.log(' ----- illegal argument to splashquery parser...')
        return undefined;
    }
};

function detailQuery(cik, filters) {
    if(filters != undefined && filters.length > 0){
        var pv;
        var delta;

        console.log(filters);
        filters.forEach(function(filter) {
            if(filter.type == 'pv')
                pv = filter;
            else if (filter.type == 'delta')
                delta = filter;
        });
    }
    
    var parsed = new Object;
    parsed.query = {
        "multi_match" : {
            "query" : cik,
            "fields" : ["_id", "cik"]
        }
    };
    parsed.fields = ["_source"];
    parsed.script_fields = setScriptFields(pv, delta);
    return parsed;
}

function resultsQuery(q) {

    var pv;
    var delta;
    var name;

    console.log(q.filters);
    q.filters.forEach(function(filter) {
        if(filter.type == 'pv') {
            pv = filter;
        } else if (filter.type == 'delta') {
            delta = filter;
        } else if (filter.type == 'name') {
            name = filter;
        }
    });

    if(q.filters.length > 0){
        var parsed = new Object;
        parsed.min_score = .001
        parsed.query = new Object;
            parsed.query.function_score = new Object;
                parsed.query.function_score.query      = setFunctionScoreQuery(name);
                parsed.query.function_score.score_mode = "multiply";
                parsed.query.function_score.functions  = setFunctions(pv, delta);
        parsed.script_fields = setScriptFields(pv, delta);
        parsed.fields = ["risk.risk_score", "risk.risk_quant", "risk.risk_prob"];
        parsed.size = SIZE;
    } else {
        var parsed = NULL_QUERY;
    }
    return parsed;
};

function currentQuery(ciks) {
    var query =  {
        "query": {
            "terms": {
                "cik" : ciks
            }
        }
    }
    return query;
}

function cikQuery(cik) {
    var query =  {
        "query": {
            "match": {
                "_id" : parseInt(cik)
            }
        }
    }
    return query;
}

function splashNetworkQuery(ciks) {
     return {
        "query": {
            "ids" : {
                "values" : ciks
            }
        },
        "size" : 9999
    }
}


function networkQuery_center(narg) {
    if(narg.id != undefined) {
        var cik = narg.id;
        narg.setData('explored', true);
    } else {
        var cik = narg;
    }

    return {
        "query": {
            "multi_match": {
                "query" : cik,
                "fields" : ["_id", "id", "cik"]
            }
        },
        "size" : 9999
    }
}

// Gets the neighbor of the clicked node
function networkQuery_neighbors(neibs){
    var neib_query = "";
    for(i = 0; i < neibs.length; i ++)
        neib_query += " " + neibs[i].nodeTo;
     return {
        "query": {
            "match": {
                "id" : {
                    "query" : neib_query,
                    "operator" : "or"
                }}},
        "size" : 9999
    }
}


exports.parse = function(type, args) {
    switch(type) {
        case 'cikQuery':
            return cikQuery(args[0]);
        case 'resultsQuery':
            return resultsQuery(args[0]);
        case 'currentQuery':
            return currentQuery(args[0]);
        case 'splashQuery':
            return splashQuery(args[0]);
        case 'detailQuery':
            return detailQuery(args[0], args[1]);
        case 'networkQuery_center':
            return networkQuery_center(args[0]);
        case 'networkQuery_neighbors':
            return networkQuery_neighbors(args[0]);
        case 'splashNetworkQuery':
            return splashNetworkQuery(args);
        default:
            console.log('unsupported query:', type)
            return undefined;
    }
}


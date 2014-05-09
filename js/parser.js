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

function currentQuery(ciks) {
    var query =  {
        "query": {
            "terms": {
                "cik" : ciks
            }
        }
    }
    console.log(query);
    return query;
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
        var pv    = filters.findBy('type', 'pv');
        var delta = filters.findBy('type', 'delta');
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
    
    var pv    = q.filters.findBy('type', 'pv');    
    var delta = q.filters.findBy('type', 'delta');
    var name  = q.filters.findBy('type', 'name');

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

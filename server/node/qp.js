// server/node/qp.js

// Query Parser -- write Elasticsearch queries

var _ = require('underscore')._

const CONSTANT_BOOST = 1000
const SIZE = 15

const CURRENT_NAME_QUERY = {
  'script': 'if(_source.company_data != null) { \n\
    if(_source.company_data.company_name != null) { \n\
      _source.company_data.company_name[_source.company_data.company_name.length-1] \n\
    } else { \n\
      null; \n\
    } \n\
  } else {\n\
    null;\n\
  }',
'lang': 'javascript'}

const LENGTH_QUERY = {
  'script': "if(doc['company_data.date'].values != null) {\n\
      doc['company_data.date'].values.length \n\
    } else { \n\
      null; \n\
    }",
'lang': 'javascript'}

const NULL_QUERY = {
  'script_fields': {
    'n_records': LENGTH_QUERY,
    'currentName': CURRENT_NAME_QUERY
  },
  'size': SIZE
}

/* --------------------- Functions for Filtering + Scoring  ---------------------- */
function setFunctions (rf) {
  var func = []

  // Whether changes exceed threshold
  if (rf.toggles.delta) {
    var delta = rf.delta
    func.push({
      'script_score': {
        'script': 'delta_score',
        'lang': 'js',
        'params': {
          'type': delta.type,
          'thresh': parseInt(delta.thresh, 10)
      }}
    })
  }

  // Presence of trading halts
  if (rf.toggles.trading_halts) {
    func.push({
      'script_score': {
        'lang': 'js',
        'script': 'trading_halt_score'
      }
    })
  }

  // Number of years below threshold
  if(rf.toggles.financials){
    var financials = rf.financials;
      func.push({
        "script_score" : {
          "lang" : "js",
          "script" : "financials_score",
            "params" : {
              "type"         : financials.type,
              "below"        : parseFloat(financials.below),
              //"to"           : financials.to,
              //"from"         : financials.from,
              "below_for"    : 2,
              "contemporary" : financials.contemporary
          }}
      });
  }

  // Number/proportion of suspicious posts
  if (rf.toggles.crowdsar) {
    var crowdsar = rf.crowdsar
    func.push({
      'script_score': {
        'lang': 'js',
        'script': 'crowdsar_score',
        'params': {
          'type': crowdsar.type,
          'past_months': parseInt(crowdsar.past_months, 10)
        }
      }
    })
  }

  if (rf.toggles.tout) {
    var tout = rf.tout
    func.push({
      'script_score': {
        'lang': 'js',
        'script': 'tout_score',
        'params': {
          'type': tout.type,
          'past_months': parseInt(tout.past_months, 10)
        }
      }
    })
  }

  if (rf.toggles.pv) {
    var pv = rf.pv
    func.push({
      'script_score': {
        'lang': 'js',
        'script': 'pv_score',
        'params': {
          'price_jump': parseFloat(pv.price_jump) / 100 + 1, // Converts 0% jump to 100% of last days price
          'volume_window': parseFloat(pv.volume_window),
          'volume_multiplier': parseFloat(pv.volume_multiplier),
          'fall_within': parseFloat(pv.fall_within),
          'fall_to': parseFloat(pv.fall_to) / 100
      }}
    })
  }

  if (rf.toggles.delinquency) {
    var delinquency = rf.delinquency
    func.push({
      'script_score': {
        'lang': 'js',
        'script': 'delinquency_score',
        'params': {
          'since': delinquency.since,
          'thresh': delinquency.thresh
      }}
    })
  }

  if (rf.toggles.network) {
    var network = rf.network
    func.push({
      'script_score': {
        'lang': 'js',
        'script': 'otc_ass_score',
        'params': {
          'type': network.type,
          'thresh': parseFloat(network.thresh)
        }
      }
    })
  }

  if (func.length > 0) {
    return func
  } else {
    return undefined
  }
}

/* Functions for Script Return */
function setScriptFields (rf, include_generic) {
  var sf = {}

  if (include_generic == undefined ? true : include_generic) {
    sf.n_records = LENGTH_QUERY
    sf.currentName = CURRENT_NAME_QUERY
  }

  if (!rf) { return sf; }

  // Number of changes in business metadata
  if (rf.toggles.delta) {
    if (rf.delta.type != undefined) {
      sf.delta = {
        'lang': 'js',
        'script': 'delta',
        'params': {
          'type': rf.delta.type
        }
      }
    }
  }

  // Number of trading halts
  if (rf.toggles.trading_halts) {
    sf.trading_halts = {
      'lang': 'js',
      'script': 'trading_halt_scriptfield'
    }
  }

  // Number of filings with revenues below threshold
  // Number/proportion of suspicious posts
  if (rf.toggles.crowdsar) {
    sf.crowdsar_scriptfield = {
      'lang': 'js',
      'script': 'crowdsar_scriptfield',
      'params': {
        'type': rf.crowdsar.type,
        'past_months': parseInt(rf.crowdsar.past_months, 10)
      }
    }
  }
  
    // Number of filings with revenues below threshold
    if(rf.toggles.financials){
      sf.financials_scriptfield = {
        "lang"   : "js",
        "script" : "financials_scriptfield",
        "params" : {
          "type"         : rf.financials.type,
          "below"        : parseFloat(rf.financials.below),
          // "to"           : rf.financials.to,
          // "from"         : rf.financials.from, 
          "below_for"     : 2,
          "contemporary" : rf.financials.contemporary
         }
      }
    }

  // Number/proportion of suspicious posts
  if (rf.toggles.tout) {
    sf.tout_scriptfield = {
      'lang': 'js',
      'script': 'tout_scriptfield',
      'params': {
        'type': rf.tout.type,
        'past_months': parseInt(rf.tout.past_months, 10)
      }
    }
  }

  // Price/volume anomalies
  if (rf.toggles.pv) {
    sf.pv_scriptfield = {
      'lang': 'js',
      'script': 'pv_scriptfield',
      'params': {
        'price_jump': parseFloat(rf.pv.price_jump) / 100 + 1, // Converts 0% jump to 100% of last days price
        'volume_window': parseFloat(rf.pv.volume_window),
        'volume_multiplier': parseFloat(rf.pv.volume_multiplier),
        'fall_within': parseFloat(rf.pv.fall_within),
        'fall_to': parseFloat(rf.pv.fall_to) / 100
      }
    }
  }

  // Late filings
  if (rf.toggles.delinquency) {
    sf.delinquency_scriptfield = {
      'lang': 'js',
      'script': 'delinquency_scriptfield',
      'params': {
        'since': rf.delinquency.since,
        'thresh': rf.delinquency.thresh
      }
    }
  }

  // OTC Neighbors
  if (rf.toggles.network) {
    sf.network_scriptfield = {
      'lang': 'js',
      'script': 'otc_ass_scriptfield',
      'params': {
        'type': rf.network.type
      }
    }
  }

  return sf
}

function rfFilterQuery (rf) {
  return {
    'min_score': CONSTANT_BOOST * (
      rf.toggles.delta +
      rf.toggles.financials +
      rf.toggles.network +
      rf.toggles.trading_halts +
      rf.toggles.delinquency
    ),
    'query': {
      'function_score': {
        'query': {'match_all': {}},
        'score_mode': 'sum',
        'functions': setFunctions(rf),
      }
    },
    'fields': ['_source'],
    'script_fields': setScriptFields(rf),
    'size': SIZE,
  }
}

/* Query for Detail Page */
function detailQuery (cik, rf) {
  return {
    'query': {
      'multi_match': {
        'query': cik,
        'fields': ['_id', 'cik'],
      }
    },
    'fields': ['_source'],
    'script_fields': setScriptFields(rf),
  }
}

/* Query for Search Function */

function companyQuery (name, rf) {
  var parsed = { }
  console.log('name :: ', name)
  parsed.min_score = .001 // Relevance to search term
  if (name !== undefined) {
    parsed.query = {
      'multi_match': {
        'query': name,
        'operator': 'and',
        'fields': ['company_name', 'cik', 'irs', 'sic', '_id', 'ticker'],
      }
    }
  } else {
    parsed.query = {'match_all': {}}
  }
  parsed.fields = ['_source']
  parsed.script_fields = setScriptFields(rf)
  parsed.size = SIZE

  return parsed
}

function topicQuery (topic, rf) {
  return {
    'size': 0,
    'query': {
      'bool': {
        'should': [
          { 'match': { 'msg': topic }},
          { 'match': { 'body': topic }}
        ],
        'minimum_should_match': 1
      }
    },
    'aggs': {
      'trending': { // gets # of docs, driven by CROWDSAR
        'terms': {
          'field': 'cik',
          'size': 99999,
          'min_doc_count': 1
        }
      },
      'cik_filter': {
        'filter': {'missing': {'field': 'cik'}},
        'aggs': {
          'trending_names': {
            'terms': {
              'script': "_source['name']",
              'size': 99999,
              'min_doc_count': 1
            }
          }
        }
      }
    }
  }
}

/* Misc Company Queries  ------------------------ */
function currentQuery (ciks, rf) {
  return {
    'size': 9999,
    'query': {
      'terms': ciks
    }
  }
}

function cikQuery (cik) {
  return {
    'query': {
      'match': {
        '_id': parseInt(cik, 10)
      }
    }
  }
}

/* Network Queries ------------------------------ */
function networkQuery_center (narg, rf) {
  if (narg.id != undefined) {
    var cik = narg.id
    narg.setData('explored', true)
  } else {
    var cik = narg
  }

  var parsed = {}
  parsed.query = { 'multi_match': {
      'query': cik,
      'fields': ['_id', 'id', 'cik']
    }
  }
  parsed.fields = ['_source']
  parsed.script_fields = setScriptFields(rf, false)
  parsed.size = 9999
  return parsed
}

function smart_parseInt (x) {
  var x_asint = parseInt(x, 10)
  return isNaN(x_asint) ? x : x_asint
}

function networkQuery_neighbors (neibs, rf) {
  return {
    '_source': ['id', 'name', 'name_id', 'data'],
    'query': {
      'ids': {
        'values': _.map(neibs, function (neib) { return smart_parseInt(neib.nodeTo); })
      }
    },
    'script_fields': setScriptFields(rf, false),
    'size': 9999
  }
}

function networkQuery_adjacencies (ids, rf) {
  return {
    'fields': ['_source'],
    'query': { 'ids': { 'values': ids } },
    'script_fields': setScriptFields(rf, false),
    'size': 9999,
  }
}

function multiCIKQuery (ciks, rf) {
  return {
    'query': {
      'ids': { 'values': _.map(ciks, smart_parseInt) },
      'fields': ['_source'],
      'script_fields': setScriptFields(rf),
      'size': 9999,
    }
  }
}

function ttsQuery (searchTerm) {
  return {
    'size': 0,
    'aggs': {
      'searchTerm_filt': { // gives # of docs, driven by CROWDSAR
        'filter': { 'term': {'body': searchTerm} },
        'aggs': {
          'searchTerm_dh': {
            'date_histogram': {
              'field': 'time',
              'interval': 'week',
            }
          }
        }
      }
    }
  }
}

/* Server Interface */
module.exports = {
  companyQuery: function (args, rf) { return companyQuery(args.searchTerm, rf) },
  topicQuery: function (args, rf) { return topicQuery(args.searchTerm, rf) },
  rfFilterQuery: function (args, rf) { return rfFilterQuery(rf) },
  detailQuery: function (args, rf) { return detailQuery(args.cik, rf) },
  multiCIKQuery: function (args, rf) { return multiCIKQuery(args.ciks, rf) },
  cikQuery: function (args, rf) { return cikQuery(args.cik) },
  resultsQuery: function (args, rf) { return resultsQuery(args.q) },
  currentQuery: function (args, rf) { return currentQuery(args.id, rf) },
  networkQuery_center: function (args, rf) { return networkQuery_center(args.cik, rf) },
  networkQuery_neighbors: function (args, rf) { return networkQuery_neighbors(args.adj, rf) },
  networkQuery_adjacencies: function (args, rf) { return networkQuery_adjacencies(args.all_ciks, rf) },
  ttsQuery: function (args, rf) { return ttsQuery(args.searchTerm) },
}

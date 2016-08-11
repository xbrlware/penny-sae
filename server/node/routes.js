// server/node/routes.js

// Helpers
function capitalizeFirstLetter (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = function (app, config, client) {
  var _ = require('underscore')._;
  //    'aggs': function (params) {
  //      var dateClause, boardClause, userClause
  //
  //      // Filter by date
  //      dateClause = {
  //        'range': {
  //          'date': {
  //            'gte': +new Date(params.date ? params.date[0] : '2010-01-01'),
  //            'lte': +new Date(params.date ? params.date[1] : '2015-01-01')
  //          }
  //        }
  //      }
  //      // Filter boards
  //      if (params.boardIds && params.boardIds.length > 0) {
  //        boardClause = {
  //          'terms': {
  //            'board_id': rsplit(params.boardIds, ',')
  //          }
  //        }
  //      }
  //      // Filter users
  //      if (params.userIds && params.userIds.length > 0) {
  //        userClause = {
  //          'terms': {
  //            'user_id': rsplit(params.userIds, ',')
  //          }
  //        }
  //      }
  //      return {
  //        'size': 0,
  //        'query': {
  //          'bool': {
  //            'must': _.filter([dateClause, boardClause, userClause])
  //          }
  //        },
  //      //        'aggs': {
  //      //          'significant_terms_general': {
  //      //            'significant_terms': {
  //      //              'field': 'msg',
  //      //              'size': 10,
  //      //              'mutual_information': {
  //      //                'include_negatives': false
  //      //              }
  //      //            }
  //      //          },
  //      //          'ents': {
  //      //            'terms': {
  //      //              'field': 'ents.entity.cat', // Change to only be person
  //      //              'size': 10
  //      //            }
  //      //          }
  //      //        }
  //      }
  //    },
  //    'search': function (params) {
  //      var clause1 = {'prefix': {}}
  //      clause1.prefix[params.type] = params.term
  //
  //      var clause2 = {'prefix': {}}
  //      clause2.prefix[params.type + '_id'] = params.term
  //
  //      var clause3
  //      if (params.type === 'board') {
  //        clause3 = {'match': {'ticker': params.term}}
  //      }
  //
  //      return {
  //        'query': {
  //          'bool': {
  //            'should': _.filter([ clause1, clause2, clause3 ]),
  //            'minimum_number_should_match': 1
  //          }
  //        },
  //        'aggs': {
  //          'top': {
  //            'terms': {
  //              'field': params.type + '_id',
  //              'size': 5
  //            }
  //          }
  //        }
  //      }
  //    }
  // };

  function redflagScript (params, score) {
    return {
      'script': {
        'id': 'ernest_test',
        'lang': 'js',
        'params': {
          'score': score,
          'params': params
        }
      }
    };
  }

  // Redflag helpers
  const DEFAULT_ = {'have': false, 'value': -1, 'is_flag': false};
  function defaultRedFlags () {
    return _.chain(_.keys(config.DEFAULT_TOGGLES))
      .map(function (k) { return [k, DEFAULT_]; })
      .object();
  }

  function prettify (x) {
    if (x.length > 12) {
      x = x.slice(0, 12) + '...';
    }
    return capitalizeFirstLetter(x);
  }

  var redflagLabel_ = {
    'financials': function (params) { return 'Low ' + prettify(params.field); },
    'symbology': function (params) { return prettify(params.field) + ' Change'; },
    'suspensions': function (params) { return 'Trading Suspensions'; },
    'delinquency': function (params) { return 'Late Filings'; },
    'otc_neighbors': function (params) { return 'OTC Neighbors'; },
    //    "pv"            : function(params) {return 'No Revenues' },
    'crowdsar': function (params) { return 'Forum Activity'; }
  };

  function redflagLabel (redFlags, redFlagParams) {
    return _.chain(redFlags)
      .map(function (v, k) {
        return [k, _.extend(v, {'label': redflagLabel_[k](redFlagParams[k])})];
      })
      .object()
      .value();
  }

  function redflagPostprocess (redFlags, redFlagParams) {
    return defaultRedFlags().extend({
      'total': _.filter(redFlags, function (x) { return x.is_flag; }).length,
      'possible': _.keys(redFlagParams).length
    })
      .extend(redflagLabel(redFlags, redFlagParams))
      .value();
  }

  var queryBuilder = {
    'search': function (query, redFlagParams) {
      return {
        '_source': ['cik', 'current_symbology.name'],
        'script_fields': {'redFlags': redflagScript(redFlagParams, false)},
        'query': { 'match_phrase': { 'searchterms': query } }
      };
    },
    'refresh': function (query, redFlagParams) {
      return {
        '_source': ['cik', 'current_symbology.name'],
        'script_fields': {'redFlags': redflagScript(redFlagParams, false)},
        'query': { 'terms': { 'cik': query } }
      };
    },
    'sort': function (redFlagParams) {
      return {
        '_source': ['cik', 'current_symbology.name'],
        'script_fields': {'redFlags': redflagScript(redFlagParams, false)},
        'query': {
          'filtered': {
            'filter': {
              'or': _.map(_.keys(redFlagParams), function (key) {
                return { 'exists': {'field': key} };
              })
            },
            'query': {
              'function_score': {
                'functions': [ {'script_score': redflagScript(redFlagParams, true)} ]
              }
            }
          }
        }
      };
    },
    'company_table': function (cik) {
      return {
        '_source': ['min_date', 'name', 'ticker', 'sic', '__meta__'],
        'query': { 'term': { 'cik': cik } }, 'sort': [{'min_date': {'order': 'desc'}}]
      };
    },
    'cik2name': function (cik) {
      return {
        '_source': ['current_symbology.name', 'current_symbology.ticker'],
        'query': { 'term': { 'cik': cik } }
      };
    },
    'cik2tickers': function (cik) {
      return {
        'query': {'term': {'cik': cik}},
        'aggs': {'tickers': {'terms': {'field': 'ticker', 'size': 0}}}
      };
    },
    'suspensions': function (cik) {
      return {
        '_source': ['company', 'link', 'date', 'release_number'],
        'query': {
          'term': {
            '__meta__.sym.cik': cik
          }
        }
      };
    },
    'pv': function (ticker) {
      return {
        'query': {
          'constant_score': {
            'filter': {
              'term': {
                'symbol.cat': ticker.toLowerCase()
              }
            }
          }
        },
        'sort': {
          'date': {
            'order': 'asc'
          }
        }
      };
    },
    'delinquency': function (cik) {
      return {
        '_source': ['form', 'date', '_enrich', 'url'],
        'query': {
          'terms': {
            'cik': [cik, cik.replace(/^0*/, '')] // Searching both widths
          }
        },
        'sort': {
          'date': {
            'order': 'desc'
          }
        }
      };
    },
    'financials': function (cik) {
      return {
        '_source': ['name', 'form', 'date', 'url', '__meta__'],
        'query': {
          'filtered': {
            'filter': {
              'exists': {
                'field': '__meta__.financials'
              }
            },
            'query': {
              'terms': {
                'cik': [cik, cik.replace(/^0*/, '')] // Searching both widths
              }
            }
          }
        }
      };
    },
    'omx': function (cik) {
      return {
        '_source': ['id', 'headline', 'date'],
        'sort': [
          {
            'date': {
              'order': 'desc'
            }
          }
        ],
        'query': {
          'match': {
            '__meta__.sym.cik': cik
          }
        }
      };
    }
  };

  app.post('/refresh', function (req, res) {
    var d = req.body;
    console.log('/refresh :: ',
      JSON.stringify(
        d.query ? queryBuilder.refresh(d.query, d.redFlagParams) : queryBuilder.sort(d.redFlagParams),
        null, 2
      )
    );

    client.search({
      'index': config['ES']['INDEX']['AGG'],
      'body': d.query ? queryBuilder.refresh(d.query, d.redFlagParams) : queryBuilder.sort(d.redFlagParams),
      'from': 0,
      'size': 15,
      // 'preference': '_primary'
    }).then(function (esResponse) {
      var hits = _.map(esResponse.hits.hits, function (hit) {
        return {
          'cik': hit['_source']['cik'],
          'name': hit['_source']['current_symbology'] ? hit['_source']['current_symbology']['name'] : '<no-name>',
          'redFlags': redflagPostprocess(hit['fields']['redFlags'][0], d.redFlagParams)
        };
      });
      res.send({
        'query_time': esResponse.took / 1000,
        'total_hits': esResponse.hits.total,
        'hits': hits
      });
    });
  });

  app.post('/search', function (req, res) {
    var d = req.body;
    console.log('/search :: ',
      JSON.stringify(
        d.query ? queryBuilder.search(d.query, d.redFlagParams) : queryBuilder.sort(d.redFlagParams),
        null, 2
      )
    );

    client.search({
      'index': config['ES']['INDEX']['AGG'],
      'body': d.query ? queryBuilder.search(d.query, d.redFlagParams) : queryBuilder.sort(d.redFlagParams),
      'from': 0,
      'size': 15,
      // 'preference': '_primary'
    }).then(function (esResponse) {
      var hits = _.map(esResponse.hits.hits, function (hit) {
        return {
          'cik': hit['_source']['cik'],
          'name': hit['_source']['current_symbology'] ? hit['_source']['current_symbology']['name'] : '<no-name>',
          'redFlags': redflagPostprocess(hit['fields']['redFlags'][0], d.redFlagParams)
        };
      });
      console.log('took = ', esResponse.took);
      res.send({
        'query_time': esResponse.took / 1000,
        'total_hits': esResponse.hits.total,
        'hits': hits
      });
    });
  });

  app.post('/company_table', function (req, res) {
    var d = req.body;
    client.search({
      'index': config['ES']['INDEX']['SYMBOLOGY'],
      'body': queryBuilder.company_table(d.cik),
      'from': 0,
      'size': 999
    }).then(function (esResponse) {
      res.send({
        'table': _.chain(esResponse.hits.hits).map(function (hit) {
          // Use SIC code unless description is available
          var sic = hit._source.sic;
          if (hit._source.__meta__) {
            if (hit._source.__meta__.sic_lab) {
              sic = hit._source.__meta__.sic_lab;
            }
          }

          return {
            'min_date': hit._source.min_date,
            'name': hit._source.name,
            'ticker': hit._source.ticker,
            'sic': sic
          };
        }).value()
      });
    });
  });

  app.post('/cik2name', function (req, res) {
    var d = req.body;
    client.search({
      'index': config['ES']['INDEX']['AGG'],
      'body': queryBuilder.cik2name(d.cik),
      'from': 0,
      'size': 999
    }).then(function (esResponse) {
      if (esResponse.hits.total) {
        var hit = esResponse.hits.hits[0]._source;
        res.send({'cik': d.cik, 'name': hit.current_symbology.name, 'ticker': hit.current_symbology.ticker});
      } else {
        res.send({'cik': d.cik, 'name': undefined, 'ticker': undefined});
      }
    });
  });

  app.post('/cik2tickers', function (req, res) {
    var d = req.body;
    client.search({
      'index': config['ES']['INDEX']['SYMBOLOGY'],
      'body': queryBuilder.cik2tickers(d.cik),
      'from': 0,
      'size': 999
    }).then(function (esResponse) {
      res.send({'tickers': _.pluck(esResponse.aggregations.tickers.buckets, 'key')});
    });
  });

  app.post('/delinquency', function (req, res) {
    var d = req.body;
    client.search({
      'index': config['ES']['INDEX']['DELINQUENCY'],
      'body': queryBuilder.delinquency(d.cik),
      'from': 0,
      'size': 10000
    }).then(function (esResponse) {
      res.send({'data': _.pluck(esResponse.hits.hits, '_source')});
    });
  });

  app.post('/financials', function (req, res) {
    var d = req.body;
    client.search({
      'index': config['ES']['INDEX']['FINANCIALS'],
      'body': queryBuilder.financials(d.cik),
      'from': 0,
      'size': 10000
    }).then(function (response) {
      res.send({'data': _.pluck(response.hits.hits, '_source')});
    });
  });

  app.post('/suspensions', function (req, res) {
    var d = req.body;
    client.search({
      'index': config['ES']['INDEX']['SUSPENSIONS'],
      'body': queryBuilder.suspensions(d.cik),
      'from': 0,
      'size': 10
    }).then(function (esResponse) {
      res.send({'data': _.pluck(esResponse.hits.hits, '_source')});
    });
  });

  app.post('/pv', function (req, res) {
    var d = req.body;
    client.search({
      'index': config['ES']['INDEX']['PV'],
      'body': queryBuilder.pv(d.ticker),
      'from': 0,
      'size': 10000
    }).then(function (esResponse) {
      res.send({'data': _.pluck(esResponse.hits.hits, '_source')});
    });
  });

  app.post('/omx', function (req, res) {
    var d = req.body;
    client.search({
      'index': config['ES']['INDEX']['OMX'],
      'body': queryBuilder.omx(d.cik),
      'from': 0,
      'size': 100
    }).then(function (esResponse) {
      res.send({'data': _.pluck(esResponse.hits.hits, '_source')});
    });
  });

  app.post('/omx_body', function (req, res) {
    var d = req.body;
    client.get({
      'index': config['ES']['INDEX']['OMX'],
      'type': 'article',
      'id': d.article_id
    }).then(function (esResponse) {
      res.send({'data': esResponse['_source']});
    });
  });
};

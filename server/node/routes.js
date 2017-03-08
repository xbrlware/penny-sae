// server/node/routes.js

module.exports = function (app, config, client) {
  var _ = require('underscore')._;
  var queryBuilder = require('./queryBuilder')(config);

  const logger = require('./logging');
  logger.level = 'debug';

  // <redflag-helpers>
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
    return x.charAt(0).toUpperCase() + x.slice(1);
  }

  var redflagLabel_ = {
    'financials': function (params) { return 'Low ' + prettify(params.field); },
    'symbology': function (params) { return prettify(params.field) + ' Change'; },
    'suspensions': function (params) { return 'Trading Suspensions'; },
    'delinquency': function (params) { return 'Late Filings'; },
    'otc_neighbors': function (params) { return 'OTC Neighbors'; },
    //    "pv"            : function(params) {return 'Price / Volume' },
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
  // </redflag-helpers>

  // <search>
  function companySearch (req, cb, query = undefined) {
    var d = req.body;

    // Coerce parameters if we injected a query
    d.query = query || d.query;
    d.mode = query ? 'refresh' : d.mode;

    client.search({
      'index': config['ES']['INDEX']['AGG'],
      'body': d.query ? queryBuilder[d.mode](d.query, d.redFlagParams) : queryBuilder.sort(d.redFlagParams),
      'from': 0,
      'size': 0,
      'requestCache': true
    }).then(function (esResponse) {
      var hits = _.map(esResponse.aggregations.top_hits.hits.hits, function (hit) {
        return {
          'cik': hit['_source']['cik'],
          'name': hit['_source']['current_symbology'] ? hit['_source']['current_symbology']['name'] : '<no-name>',
          'redFlags': redflagPostprocess(hit['fields']['redFlags'][0], d.redFlagParams)
        };
      });
      cb({
        'query_time': esResponse.took / 1000,
        'total_hits': esResponse.hits.total,
        'hits': hits
      });
    });
  }

  function topicSearch (req, cb) {
    var d = req.body;
    client.search({
      'index': config['ES']['INDEX']['CROWDSAR'],
      'body': queryBuilder.topic.cik(d.query, 50),
      'from': 0,
      'size': 0,
      'requestCache': true
    }).then(function (esResponse) {
      var ciks = _.pluck(esResponse.aggregations.ciks.buckets, 'key').slice(0, 50);
      companySearch(req, function (companyResponse) {
        companyResponse.hits = _.chain(companyResponse.hits).sortBy(function (x) {
          return _.indexOf(ciks, '' + x['cik']);
        })
          .zip(esResponse.aggregations.ciks.buckets)
          .map(function (x) {
            return _.extend(x[0], {
              '__topic__': {
                'doc_count': x[1]['doc_count']
              }
            });
          })
          .value();
        cb(companyResponse);
      }, ciks);
    });
  }

  app.post('/search', function (req, res) {
    !req.body.searchTopic ? companySearch(req, (x) => res.send(x)) : topicSearch(req, (x) => res.send(x));
  });
  // </search>

  // <details>
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
          var sicLab = (hit._source.__meta__ || {'sicLab': undefined}).sicLab;
          return {
            'min_date': hit._source.min_date,
            'name': hit._source.name,
            'ticker': hit._source.ticker,
            'sic': sicLab || hit._source.sic
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
    logger.info('/omx :: ', d);
    client.search({
      'index': config['ES']['INDEX']['OMX'],
      'body': queryBuilder.omx(d),
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
// </details>
};

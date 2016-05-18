// server/node/routes.js

module.exports = function (app, config, client) {
  var qp = require('./qp.js');
  var async = require('async');
  var _s = require('underscore.string');
  var _ = require('underscore')._;

  function sortDecreasing (a, b) {
    if (a[1] < b[1]) return 1;
    if (a[1] > b[1]) return -1;
    return 0;
  }

  function setRedFlags (rfClean, f) {
    var out = {};
    out.delta_redflag = false;
    out.financials_redflag = false;
    out.trading_halts_redflag = false;
    out.delinquency_redflag = false;
    out.network_redflag = false;
    out.delta_value = false;
    out.financials_value = false;
    out.trading_halts_value = false;
    out.delinquency_value = false;
    out.network_value = false;

    if (f.delta !== undefined) {
      out.have_delta = true;
      out.delta_value = f.delta[0].nchange;
      out.delta_redflag = f.delta[0].nchange >= rfClean.delta.thresh;
    }

    if (f.financials_scriptfield !== undefined) {
      out.have_financials = true;
      out.financials_value = f.financials_scriptfield[0];
      out.financials_redflag = f.financials_scriptfield[0] > 0;
    }

    if (f.trading_halts !== undefined) {
      out.have_trading_halts = true;
      out.trading_halts_value = f.trading_halts[0];
      out.trading_halts_redflag = f.trading_halts[0] > 0;
    }

    if (f.delinquency_scriptfield !== undefined) {
      out.have_delinquency = true;
      out.delinquency_value = f.delinquency_scriptfield[0];
      out.delinquency_redflag = f.delinquency_scriptfield[0] >= rfClean.delinquency.thresh;
    }

    if (f.network_scriptfield !== undefined) {
      out.have_network = true;
      out.network_value = f.network_scriptfield[0];
      out.network_redflag = f.network_scriptfield[0] > rfClean.network.thresh;
    }

    if (f.crowdsar_scriptfield !== undefined) {
      out.have_crowdsar = true;
      out.crowdsar_value = f.crowdsar_scriptfield[0];
      out.crowdsar_redflag = f.crowdsar_scriptfield[0] > 0;
    }

    if (f.pv_scriptfield !== undefined) {
      out.have_pv = true;
      if (Object.keys(f.pv_scriptfield[0]).length > 0) {
        out.pv_value = f.pv_scriptfield[0].condition_met.length;
        out.pv_redflag = f.pv_scriptfield[0].condition_met.length > 0;
      }
    }

    out.total = out.delta_redflag + out.financials_redflag + out.trading_halts_redflag +
    out.delinquency_redflag + out.network_redflag;
    out.possible = rfClean.toggles.delta + rfClean.toggles.financials + rfClean.toggles.trading_halts +
    rfClean.toggles.delinquency + rfClean.toggles.network;
    return out;
  }

  app.post('/fetch_tts', function (req, res) {
    var d = req.body;
    var body = qp.ttsQuery(d.query_args, undefined);
    client.search({
      index: 'omx',
      body: body
    }).then(function (esResponse) {
      var buckets = esResponse.aggregations.searchTerm_filt.searchTerm_dh.buckets;
      res.send(buckets);
    });
  });

  function topicSummaryStatistics (data, rfClean, callback) {  // eslint-disable-line no-unused-vars
    var hits = data.hits.hits;
    var rfTotal = 0;
    var rfPossible = 0;
    var rfAny = 0;
    var count = 0;
    var agg = {};
    var cdSet = {};
    var cdLastSet = {};

    hits.map(function (x) {
      if (x.fields !== undefined) {
        var rf = setRedFlags(rfClean, x.fields);
        Object.keys(rf).map(function (k) {
          if (k in agg) {
            agg[k] += rf[k];
          } else {
            agg[k] = rf[k];
          }
        });

        rfTotal += rf.total;
        rfPossible += rf.possible;

        if (rf.total > 0) { rfAny++; }

        count++;
      }

      var cd = x._source.companyData;
      if (cd !== undefined) {
        if (cd.sic !== undefined) {
          // All previous SIC
          cd.sic.map(function (c) {
            if (c in cdSet) {
              cdSet[c]++;
            } else {
              cdSet[c] = 1;
            }
          });

          // Current SIC
          var cdLast = cd.sic[cd.sic.length - 1];

          if (cdLast in cdLastSet) {
            cdLastSet[cdLast]++;
          } else {
            cdLastSet[cdLast] = 1;
          }
        }
      }
    });

    var agg2 = [];
    Object.keys(agg).map(function (k) {
      agg2.push([k, agg[k]]);
    });

    var cdLastSet2 = [];
    Object.keys(cdLastSet).map(function (k) {
      cdLastSet2.push([k, cdLastSet[k]]);
    });

    agg2 = agg2.sort(sortDecreasing);
    cdLastSet2 = cdLastSet2.sort(sortDecreasing);

    data.tss = {'agg': agg2, 'cd': cdSet, 'cdLast': cdLastSet2,
      'rfTotal': rfTotal, 'rfPossible': rfPossible,
    'count': count, 'rfAny': rfAny};
    callback(data);
  }

  // <<
  function redflagScript (params, score) {
    return {
      'script': {
        'file': 'ernest',
        'lang': 'js',
        'params': {
          'score': score,
          'params': params
        }
      }
    };
  }

  const REDFLAG_NAMES = ['financials', 'symbology', 'trading_halts', 'delinquency', 'network', 'pv', 'crowdsar'];
  const DEFAULT_ = {'have': false, 'value': -1, 'is_flag': false};

  function redflagPostprocess (redFlags, redflagParams) {
    return _.chain(REDFLAG_NAMES).map(function (k) { return [k, DEFAULT_]; }).object().extend({
      'total': _.keys(redFlags).length,
      'possible': _.keys(redflagParams).length
    }).extend(redFlags).value();
  }

  var queryBuilder = {
    'search': function (query, redflagParams) {
      return {
        '_source': ['cik', 'current_symbology.name'],
        'script_fields': {'redFlags': redflagScript(redflagParams, false)},
        'query': { 'match_phrase': { 'searchterms': query } }
      };
    },
    'sort': function (redflagParams) {
      return {
        '_source': ['cik', 'current_symbology.name'],
        'script_fields': {'redFlags': redflagScript(redflagParams, false)},
        'query': {
          'function_score': {
            'functions': [ {'script_score': redflagScript(redflagParams, true)} ]
          }
        }
      };
    },
    'company_table': function (cik) {
      return {
        '_source': ['min_date', 'max_date', 'name', 'ticker', 'sic'],
        'query': { 'term': { 'cik': cik } }
      };
    },
    'cik2name': function (cik) {
      return {
        '_source': ['current_symbology.name', 'current_symbology.ticker'],
        'query': { 'term': { 'cik': cik } }
      };
    }
  };

  app.post('/search', function (req, res) {
    var d = req.body;

    console.log('/search :: ',
      JSON.stringify(
        d.query ? queryBuilder.search(d.query, d.redflagParams) : queryBuilder.sort(d.redflagParams)
      )
    );

    client.search({
      'index': 'ernest_agg',
      'body': d.query ? queryBuilder.search(d.query, d.redflagParams) : queryBuilder.sort(d.redflagParams),
      'from': 0,
      'size': 15
    }).then(function (esResponse) {
      var hits = _.map(esResponse.hits.hits, function (hit) {
        return {
          'cik': hit['_source']['cik'],
          'name': hit['_source']['current_symbology'] ? hit['_source']['current_symbology']['name'] : '<no-name>',
          'redFlags': redflagPostprocess(hit['fields']['redFlags'][0], d.redflagParams)
        };
      });
      console.log('hits :: ', hits);
      res.send({
        'total_hits': esResponse.hits.total,
        'hits': hits
      });
    });
  });

  app.post('/company_table', function (req, res) {
    var d = req.body;
    client.search({
      'index': 'ernest_symbology',
      'body': queryBuilder.company_table(d.cik),
      'from': 0,
      'size': 999
    }).then(function (esResponse) {
      res.send({
        'table': _.chain(esResponse.hits.hits).sortBy(function (hit) { return hit._source.min_date; }).map(function (hit) {
          return [
            hit._source.min_date,
            hit._source.max_date,
            hit._source.name,
            hit._source.ticker,
            hit._source.sic
          ];
        }).value()
      });
    });
  });

  app.post('/cik2name', function (req, res) {
    var d = req.body;
    client.search({
      'index': 'ernest_agg',
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
  // >>

  //  app.post('/fetch_companies', function(req, res) {
  //    var d = req.body
  //    var index = (d.index !== config.NETWORK_INDEX && d.index !== 'network') ? d.index : [config.NETWORK_INDEX, config.COMPANY_INDEX]
  //
  //    console.log('fetch_companies :: ', JSON.stringify(qp[d.query_type](d.query_args, d.rf)))
  //
  //    client.search({
  //      "index" : index,
  //      "body"  : qp[d.query_type](d.query_args, d.rf),
  //      "from"  : d.from === undefined ? 0 : d.from,
  //    }).then(function (esResponse) {
  //        res.send(esResponse)
  //    })
  //  })

  // Named Entity Recognition Page
  app.post('/fetch_ner', function (req, res) {
    var d = req.body;
    client.get({
      index: 'ner',
      type: 'cik',
      id: d.cik
    }).then(function (esResponse) {
      var tmp = _.map(esResponse._source.ner, function (x) {
        if (x.hidden === undefined) {
          x.hidden = false;
        }
        if (x.hidden && !d.show_hidden) {
          return undefined;
        } else {
          return {
            name: x.name[0],
            cnt_total: x.cnt_total[0],
            occ_total: x.occ_total[0],
            records: x.records,
            hidden: x.hidden
          };
        }
      });
      tmp = _.filter(tmp, function (x) { return x !== undefined; });
      tmp = _.sortBy(tmp, function (x) { return x.cnt_total; });
      tmp.reverse();
      res.send(tmp);
    },
    function (error) {
      console.error(error);
      res.send([undefined]);
    }
    );
  });

  app.post('/set_ner', function (req, res) {
    var d = req.body;
    client.get({
      index: config.NETWORK_INDEX,
      type: 'actor',
      id: d.cik
    }).then(function (orig) {
      _.map(orig._source.adjacencies, function (origAdj) {
        var update = _.where(d.updates, {'nodeTo': origAdj.nodeTo})[0];
        if (update !== undefined) {
          origAdj.data.hidden = update.hidden;
        } else {
          origAdj.data.hidden = true;
        }
      });

      client.index({
        index: config.NETWORK_INDEX,
        type: 'actor',
        id: d.cik,
        body: orig._source
      }).then(function (resp) {
        res.send(resp);
      });
    });
  });

  app.post('/red_flag_individuals', function (req, res) {
    var d = req.body;
    var allCiks = d.query_args.allCiks;

    function calculateRfIndividual (cik, callback) {
      // Get companies that individual is connected to
      client.search({
        index: config.NETWORK_INDEX,
        body: qp.networkQuery_center({'cik': cik}, d.rf),
        from: 0
      }).then(function (data) {
        var adj = data.hits.hits[0]._source.adjacencies;
        var nodeTos = _.pluck(adj, 'nodeTo');

        client.search({
          index: config.COMPANY_INDEX,
          body: qp.multiCIKQuery({'ciks': nodeTos}, d.rf),
          from: 0
        }).then(function (companyData) {
          var cd = companyData.hits.hits;
          var rfTotal = 0;
          var rfPossible = 0;
          var nAss = 0;
          cd.map(function (x) {
            var rf = setRedFlags(d.rf, x.fields);
            rfTotal += rf.total;
            rfPossible += rf.possible;
            nAss++;
          });

          var rfScore = rfPossible > 0 ? Math.round(100 * rfTotal / nAss) / 100 : -1;
          rfScore = isNaN(rfScore) ? 0 : rfScore;
        }).then(function () {
          callback(null, {'cik': cik, 'avg': rfScore, 'total': rfTotal, 'possible': rfPossible, 'nAss': nAss});
        });
      });
    }

    async.map(allCiks, calculateRfIndividual, function (err, results) {
      res.send(results);
    });
  });

  app.post('/search_omx', function (req, res) {
    var d = req.body;
    client.search({
      'index': 'omx',
      'type': 'release',
      'body': {
        'query': {
          'match': {
            'cik': _s.pad(d.cik, 10, '0')
          }
        },
        'sort': [
          { 'time': {
              'order': 'desc'
            }
          }
        ],
        'size': 100
      }
    }).then(function (response) {
      res.send(
        _.map(response.hits.hits, function (hit) {
          var src = hit._source;
          src._id = hit._id;
          return src;
        })
      );
    });
  });

  app.post('/fetch_omx', function (req, res) {
    var d = req.body;
    client.get({
      'index': 'omx',
      'type': 'release',
      'id': d.omx_id
    }).then(function (response) {
      res.send(response._source);
    });
  });

  app.post('/fetch_leadership', function (req, res) {
    var d = req.body;
    var flatten_obj = function (x, result, prefix) {
      if (_.isObject(x)) {
        _.each(x, function (v, k) {
          flatten_obj(v, result, prefix ? prefix + '_' + k : k);
        });
      } else {
        result[prefix] = x;
      }
      return result;
    };

    client.search({
      'index': 'forms',
      'type': '4',
      'body': {
        '_source': [
          'ownershipDocument.reportingOwner.reportingOwnerRelationship',
          'ownershipDocument.periodOfReport',
          'ownershipDocument.reportingOwner.reportingOwnerId'
        ],
        'size': 999999,
        'query': {
          'match': {
            'ownershipDocument.issuer.issuerCik': _s.pad(d.cik, 10, '0')
          }
        }
      }
    }).then(function (response) {
      var hits = response.hits.hits;
      var src = _.chain(hits)
        .pluck('_source')
        .pluck('ownershipDocument')
        .map(function (x) {
          if (x.reportingOwner.length === undefined) {
            x.reportingOwner = [x.reportingOwner];
          }
          _.map(x.reportingOwner, function (y) {
            y.periodOfReport = x.periodOfReport;
          });
          return x;
        })
        .pluck('reportingOwner')
        .flatten()
        .map(function (x) {return flatten_obj(x, {});})
        .groupBy('reportingOwnerId_rptOwnerCik')
        .value();

      var poses = [
        'reportingOwnerRelationship_isDirector',
        'reportingOwnerRelationship_isOfficer',
        'reportingOwnerRelationship_isTenPercentOwner',
        'reportingOwnerRelationship_isOther'
      ];

      var dates = _.chain(_.values(src))
        .map(function (x) {
          var out = {
            'name': x[0]['reportingOwnerId_rptOwnerName'],
            'cik': x[0]['reportingOwnerId_rptOwnerCik']
          };

          function get_pos (pos, out) {
            var dates = _.chain(x)
              .filter(function (y) {return y[pos] === '1';})
              .pluck('periodOfReport')
              .value();

            var max = _.max(dates, function (d) {return new Date(d);});
            var min = _.min(dates, function (d) {return new Date(d);});
            if (max !== -Infinity) {
              out[pos] = {
                'start': min,
                'stop': max
              };
            }
            return out;
          }

          _.map(poses, function (pos) {
            out = get_pos(pos, out);
          });
          return out;
        }).value();

      res.send({'dates': dates, 'posNames': poses});
    });
  });
};

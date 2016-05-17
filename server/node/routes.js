// server/node/routes.js

module.exports = function (app, config, client) {
  var qp = require('./qp.js'),
    async = require('async'),
    _s = require('underscore.string'),
    _ = require('underscore')._

  function sort_decreasing (a, b) {
    if (a[1] < b[1]) return 1
    if (a[1] > b[1]) return -1
    return 0
  }

  function setRedFlags (rf_clean, f) {
    var out = {}
    out.delta_redflag = false
    out.financials_redflag = false
    out.trading_halts_redflag = false
    out.delinquency_redflag = false
    out.network_redflag = false
    out.delta_value = false
    out.financials_value = false
    out.trading_halts_value = false
    out.delinquency_value = false
    out.network_value = false

    if (f.delta !== undefined) {
      out.have_delta = true
      out.delta_value = f.delta[0].nchange
      out.delta_redflag = f.delta[0].nchange >= rf_clean.delta.thresh
    }

    if (f.financials_scriptfield !== undefined) {
      out.have_financials = true
      out.financials_value = f.financials_scriptfield[0]
      out.financials_redflag = f.financials_scriptfield[0] > 0
    }

    if (f.trading_halts !== undefined) {
      out.have_trading_halts = true
      out.trading_halts_value = f.trading_halts[0]
      out.trading_halts_redflag = f.trading_halts[0] > 0
    }

    if (f.delinquency_scriptfield !== undefined) {
      out.have_delinquency = true
      out.delinquency_value = f.delinquency_scriptfield[0]
      out.delinquency_redflag = f.delinquency_scriptfield[0] >= rf_clean.delinquency.thresh
    }

    if (f.network_scriptfield !== undefined) {
      out.have_network = true
      out.network_value = f.network_scriptfield[0]
      out.network_redflag = f.network_scriptfield[0] > rf_clean.network.thresh
    }

    if (f.crowdsar_scriptfield !== undefined) {
      out.have_crowdsar = true
      out.crowdsar_value = f.crowdsar_scriptfield[0]
      out.crowdsar_redflag = f.crowdsar_scriptfield[0] > 0
    }

    if (f.pv_scriptfield !== undefined) {
      out.have_pv = true
      if (Object.keys(f.pv_scriptfield[0]).length > 0) {
        out.pv_value = f.pv_scriptfield[0].condition_met.length
        out.pv_redflag = f.pv_scriptfield[0].condition_met.length > 0
      }
    }

    out.total = out.delta_redflag + out.financials_redflag + out.trading_halts_redflag +
    out.delinquency_redflag + out.network_redflag
    out.possible = rf_clean.toggles.delta + rf_clean.toggles.financials + rf_clean.toggles.trading_halts +
    rf_clean.toggles.delinquency + rf_clean.toggles.network
    return out
  }

  app.post('/fetch_tts', function (req, res) {
    var d = req.body
    var body = qp.ttsQuery(d.query_args, undefined)
    client.search({
      index: 'omx',
      body: body
    }).then(function (es_response) {
      var buckets = es_response.aggregations.searchTerm_filt.searchTerm_dh.buckets
      res.send(buckets)
    })
  })

  function topic_summary_statistics (data, rf_clean, callback) {
    hits = data.hits.hits
    rf_total = 0
    rf_possible = 0
    rf_any = 0
    count = 0
    agg = {}
    cd_set = {}
    cd_last_set = {}

    hits.map(function (x) {
      if (x.fields !== undefined) {
        var rf = setRedFlags(rf_clean, x.fields)
        Object.keys(rf).map(function (k) {
          if (k in agg) {
            agg[k] += rf[k]
          } else {
            agg[k] = rf[k]
          }
        })

        rf_total += rf.total
        rf_possible += rf.possible

        if (rf.total > 0) { rf_any++; }

        count++
      }

      var cd = x._source.company_data
      if (cd !== undefined) {
        if (cd.sic !== undefined) {
          // All previous SIC
          cd.sic.map(function (c) {
            if (c in cd_set) {
              cd_set[c]++
            } else {
              cd_set[c] = 1
            }
          })

          // Current SIC
          var cd_last = cd.sic[cd.sic.length - 1]

          if (cd_last in cd_last_set) {
            cd_last_set[cd_last]++
          } else {
            cd_last_set[cd_last] = 1
          }
        }
      }
    })

    var agg2 = []
    Object.keys(agg).map(function (k) {
      agg2.push([k, agg[k]])
    })

    var cd_last_set2 = []
    Object.keys(cd_last_set).map(function (k) {
      cd_last_set2.push([k, cd_last_set[k]])
    })

    agg2 = agg2.sort(sort_decreasing)
    cd_last_set2 = cd_last_set2.sort(sort_decreasing)

    data.tss = {'agg': agg2, 'cd': cd_set, 'cd_last': cd_last_set2,
      'rf_total': rf_total, 'rf_possible': rf_possible,
    'count': count, 'rf_any': rf_any}
    callback(data)
  }

  // <<
  function redflagScript (params, score) {
    return {
        'script': {
            'file': 'ernest',
            'lang': 'js',
            'params': {
                'score' : score,
                'params': params
            }
        }
    }
  }
  
  const REDFLAG_NAMES = ['financials', 'symbology', 'trading_halts', 'delinquency', 'network', 'pv', 'crowdsar']
  const DEFAULT_      = {'have': false, 'value': -1, 'is_flag': false};
  
  function redflagPostprocess (red_flags, redflag_params) {
    return _.chain(REDFLAG_NAMES).map(function(k) { return [k, DEFAULT_] }).object().extend({
        'total'   : _.keys(red_flags).length,
        'possible': _.keys(redflag_params).length,
    }).extend(red_flags).value();
  }

  queryBuilder = {
    'search': function (query, redflag_params) {
      return {
        '_source': ['cik', 'current_symbology.name'],
        'script_fields': {"red_flags" : redflagScript(redflag_params, false)},
        'query' : { 'match_phrase': { 'searchterms': query } }
      }
    },
    'sort': function (redflag_params) {
      return {
        '_source': ['cik', 'current_symbology.name'],
        'script_fields': {"red_flags" : redflagScript(redflag_params, false)},
        'query': {
          'function_score': {
            'functions'  : [ {"script_score" : redflagScript(redflag_params, true)} ]
          }
        }
      }
    },
    'company_table': function (cik) {
      return {
        '_source': ['min_date', 'max_date', 'name', 'ticker', 'sic'],
        'query': { 'term': { 'cik': cik } }
      }
    },
    'cik2name': function (cik) {
      return {
        '_source': ['current_symbology.name', 'current_symbology.ticker'],
        'query': { 'term': { 'cik': cik } }
      }
    }
  }

  app.post('/search', function (req, res) {
    var d = req.body

    console.log('/search :: ',
        JSON.stringify(
            d.query ? queryBuilder.search(d.query, d.redflag_params) : queryBuilder.sort(d.redflag_params)
        )
    );
    
    client.search({
      'index': 'ernest_agg',
      'body': d.query ? queryBuilder.search(d.query, d.redflag_params) : queryBuilder.sort(d.redflag_params),
      'from': 0,
      'size': 15,
    }).then(function (es_response) {

      var hits = _.map(es_response.hits.hits, function (hit) {
        return {
          'cik': hit['_source']['cik'],
          'name': hit['_source']['current_symbology'] ? hit['_source']['current_symbology']['name'] : '<no-name>',
          'red_flags': redflagPostprocess(hit['fields']['red_flags'][0], d.redflag_params),
        }
      })
      console.log('hits :: ', hits);
      res.send({
        'total_hits': es_response.hits.total,
        'hits': hits,
      })
    })
  })

  app.post('/company_table', function (req, res) {
    var d = req.body
    client.search({
      'index': 'ernest_symbology',
      'body': queryBuilder.company_table(d.cik),
      'from': 0,
      'size': 999,
    }).then(function (es_response) {
      res.send({
        'table': _.chain(es_response.hits.hits).sortBy(function (hit) {return hit._source.min_date}).map(function (hit) {
          return [
            hit._source.min_date,
            hit._source.max_date,
            hit._source.name,
            hit._source.ticker,
            hit._source.sic,
          ]
        }).value()
      })
    })
  })

  app.post('/cik2name', function (req, res) {
    var d = req.body
    client.search({
      'index': 'ernest_agg',
      'body': queryBuilder.cik2name(d.cik),
      'from': 0,
      'size': 999,
    }).then(function (es_response) {
      if (es_response.hits.total) {
        var hit = es_response.hits.hits[0]._source
        res.send({'cik': d.cik, 'name': hit.current_symbology.name, 'ticker': hit.current_symbology.ticker})
      } else {
        res.send({'cik': d.cik, 'name': undefined, 'ticker': undefined})
      }
    })
  })
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
  //    }).then(function (es_response) {
  //        res.send(es_response)
  //    })
  //  })

  // Named Entity Recognition Page
  app.post('/fetch_ner', function (req, res) {
    var d = req.body
    client.get({
      index: 'ner',
      type: 'cik',
      id: d.cik
    }).then(function (es_response) {
      var tmp = _.map(es_response._source.ner, function (x) {
        if (x.hidden === undefined) {
          x.hidden = false
        }
        if (x.hidden && !d.show_hidden) {
          return undefined
        } else {
          return {
            name: x.name[0],
            cnt_total: x.cnt_total[0],
            occ_total: x.occ_total[0],
            records: x.records,
            hidden: x.hidden
          }
        }
      })
      tmp = _.filter(tmp, function (x) {return x !== undefined;})
      tmp = _.sortBy(tmp, function (x) {return x.cnt_total;})
      tmp.reverse()
      res.send(tmp)
    }, function (error) {
      res.send([undefined])
    }
    )
  })

  app.post('/set_ner', function (req, res) {
    var d = req.body
    client.get({
      index: config.NETWORK_INDEX,
      type: 'actor',
      id: d.cik
    }).then(function (orig) {
      _.map(orig._source.adjacencies, function (orig_adj) {
        var update = _.where(d.updates, {'nodeTo': orig_adj.nodeTo})[0]
        if (update !== undefined) {
          orig_adj.data.hidden = update.hidden
        } else {
          orig_adj.data.hidden = true
        }
      })

      client.index({
        index: config.NETWORK_INDEX,
        type: 'actor',
        id: d.cik,
        body: orig._source
      }).then(function (resp) {
        res.send(resp)
      })
    })
  })

  app.post('/red_flag_individuals', function (req, res) {
    var d = req.body
    var all_ciks = d.query_args.all_ciks

    function calculate_rf_individual (cik, callback) {
      // Get companies that individual is connected to
      client.search({
        index: config.NETWORK_INDEX,
        body: qp.networkQuery_center({'cik': cik}, d.rf),
        from: 0,
      }).then(function (data) {
        var adj = data.hits.hits[0]._source.adjacencies
        var nodeTos = _.pluck(adj, 'nodeTo')

        client.search({
          index: config.COMPANY_INDEX,
          body: qp.multiCIKQuery({'ciks': nodeTos}, d.rf),
          from: 0
        }).then(function (company_data) {
          var company_data = company_data.hits.hits
          var rf_total = 0
          var rf_possible = 0
          var n_ass = 0
          company_data.map(function (x) {
            var rf = setRedFlags(d.rf, x.fields)
            rf_total += rf.total
            rf_possible += rf.possible
            n_ass++
          })

          var rf_score = rf_possible > 0 ? Math.round(100 * rf_total / n_ass) / 100 : -1
          rf_score = isNaN(rf_score) ? 0 : rf_score
        }).then(function () {
          callback(null, {'cik': cik, 'avg': rf_score, 'total': rf_total, 'possible': rf_possible, 'n_ass': n_ass})
        })
      })
    }

    async.map(all_ciks, calculate_rf_individual, function (err, results) {
      res.send(results)
    })
  })

  app.post('/search_omx', function (req, res) {
    var d = req.body
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
          var src = hit._source
          src._id = hit._id
          return src
        })
      )
    })
  })

  app.post('/fetch_omx', function (req, res) {
    var d = req.body
    client.get({
      'index': 'omx',
      'type': 'release',
      'id': d.omx_id
    }).then(function (response) {
      res.send(response._source)
    })
  })

  app.post('/fetch_leadership', function (req, res) {
    var d = req.body
    var flatten_obj = function (x, result, prefix) {
      if (_.isObject(x)) {
        _.each(x, function (v, k) {
          flatten_obj(v, result, prefix ? prefix + '_' + k : k)
        })
      } else {
        result[prefix] = x
      }
      return result
    }

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
      var hits = response.hits.hits
      var src = _.chain(hits)
        .pluck('_source')
        .pluck('ownershipDocument')
        .map(function (x) {
          if (x.reportingOwner.length === undefined) {
            x.reportingOwner = [x.reportingOwner]
          }
          _.map(x.reportingOwner, function (y) {
            y.periodOfReport = x.periodOfReport
          })
          return x
        })
        .pluck('reportingOwner')
        .flatten()
        .map(function (x) {return flatten_obj(x, {});})
        .groupBy('reportingOwnerId_rptOwnerCik')
        .value()

      var poses = [
        'reportingOwnerRelationship_isDirector',
        'reportingOwnerRelationship_isOfficer',
        'reportingOwnerRelationship_isTenPercentOwner',
        'reportingOwnerRelationship_isOther'
      ]

      var dates = _.chain(_.values(src))
        .map(function (x) {
          var out = {
            'name': x[0]['reportingOwnerId_rptOwnerName'],
            'cik': x[0]['reportingOwnerId_rptOwnerCik']
          }

          function get_pos (pos, out) {
            var dates = _.chain(x)
              .filter(function (y) {return y[pos] === '1';})
              .pluck('periodOfReport')
              .value()

            var max = _.max(dates, function (d) {return new Date(d);})
            var min = _.min(dates, function (d) {return new Date(d);})
            if (max !== -Infinity) {
              out[pos] = {
                'start': min,
                'stop': max
              }
            }
            return out
          }

          _.map(poses, function (pos) {
            out = get_pos(pos, out)
          })
          return out
        }).value()

      res.send({'dates': dates, 'posNames': poses})
    })
  })
}

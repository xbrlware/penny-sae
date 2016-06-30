// server/node/routes.js

// Helpers
function capitalizeFirstLetter (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = function (app, config, client) {
  var _ = require('underscore')._;
  var async = require('async');

  var pennyQueryBuilder = {
    'board': function (brdData) {
      return {
        'size': 1000, // This limits the hits to 1000
        '_source': ['time', 'user_id', 'user', 'board_id', 'board', 'msg', 'ticker'],
        'query': {
          'filtered': {
            'filter': {
              'range': {
                'time': {
                  'gte': brdData.date_filter[0],
                  'lte': brdData.date_filter[1]
                }
              }
            },
            'query': {
              'constant_score': {
                'filter': {
                  'term': {
                    '__meta__.sym.cik': brdData.cik
                  }
                }
              }
            }
          }
        },
        'sort': {'time': 'desc'}
      };
    },
    'boardTimeline': function (btData) {
      return {
        'size': 0,
        'query': {
          'constant_score': {
            'filter': {
              'term': {
                '__meta__.sym.cik': btData.cik
              }
            }
          }
        },
        'aggs': {
          'board_histogram': {
            'date_histogram': {
              'field': 'time',
              'interval': 'day',
              'min_doc_count': 1
            }
          }
        }
      };
    },
    'timeline': function (tData) {
      return {
        'size': 0,
        'query': {
          'filtered': {
            'filter': {
              'range': {
                'time': {
                  'gte': tData.date_filter[0],
                  'lte': tData.date_filter[1]
                }
              }
            },
            'query': {
              'constant_score': {
                'filter': {
                  'term': {
                    '__meta__.sym.cik': tData.cik
                  }
                }
              }
            }
          }
        },
        'aggs': {
          'posts': {
            'terms': {
              'script': "doc['user_id'].value + '|' + doc['user.cat'].value",
              'size': 10,
              'order': {
                '_count': 'desc'
              }
            },
            'aggs': {
              'user_histogram': {
                'date_histogram': {
                  'field': 'time',
                  'interval': 'day',
                  'min_doc_count': 1
                }
              },
              'pos': {
                'avg': {
                  'field': '__meta__.tri_pred.pos'
                }
              },
              'neut': {
                'avg': {
                  'field': '__meta__.tri_pred.neut'
                }
              },
              'neg': {
                'avg': {
                  'field': '__meta__.tri_pred.neg'
                }
              }
            }
          }
        }
      };
    },
    'user': function (users) {
      return {
        'size': 1000,
        '_source': ['time', 'user_id', 'user', 'board_id', 'board', 'msg', 'ticker'],
        'query': {
          'filtered': {
            'filter': {
              'range': {
                'time': {
                  'gte': users.date_filter[0],
                  'lte': users.date_filter[1]
                }
              }
            },
            'query': {
              'bool': {
                'must': [
                  {'match': { '__meta__.sym.cik': users.cik }},
                  {'terms': { 'user_id': users.users }}
                ]
              }
            }
          }
        },
        'sort': {
          'time': {
            'order': 'desc'
          }
        }
      };
    }

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
  };

  app.post('/user', function (req, res) {
    var d = req.body;
    console.log('/user ::', d);
    if (!d.cik || !d.users || !d.date_filter) {
      return res.send([]);
    }
    client.search({
      index: config['ES']['INDEX']['CROWDSAR'],
      body: pennyQueryBuilder.user(d)
    }).then(function (response) {
      res.send(_.pluck(response.hits.hits, '_source'));
    });
  });

  app.post('/board', function (req, res) {
    var d = req.body;
    console.log('/board ::', d);
    if (!d.cik || !d.date_filter || !d.ticker) {
      console.log('/board :: null ticker');
      return res.send({'data': [], 'pvData': [], 'ptData': [], 'tlData': []});
    }
    async.parallel([
      function (cb) { getForumdata(d, cb); },
      function (cb) { getPvData(d, cb); },
      function (cb) { getPostsTimelineData(d, cb); },
      function (cb) { getTimelineData(d, cb); }
    ], function (err, results) {
      if (err) { console.log(err); }
      res.send({
        'data': results[0],
        'pvData': results[1],
        'ptData': results[2],
        'tlData': results[3]
      });
    });
  });

  app.post('/redraw', function (req, res) {
    var d = req.body;
    console.log('/redraw ::', d);
    if (!d.cik || !d.date_filter) {
      return res.send([]);
    }
    getTimelineData(d, function (n, resp) {
      res.send(resp);
    });
  });

  function getTimelineData (data, cb) {
    console.log('getTimelineData', data);
    client.search({
      index: config['ES']['INDEX']['CROWDSAR'],
      body: pennyQueryBuilder.timeline(data)
    }).then(function (response) {
      var q = _.map(response.aggregations.posts.buckets, function (x) {
        var temp = x.key.split('|');
        return {id: temp[0],
          user: temp[1],
          doc_count: x.doc_count,
          pos: x.pos.value,
          neut: x.neut.value,
          neg: x.neg.value,
        timeline: x.user_histogram.buckets};
      });
      console.log('/getTimelineData :: returned', q.length);
      cb(null, q);
      return;
    });
  }

  function getPostsTimelineData (data, cb) {
    console.log('getPostsTimelineData', data);
    client.search({
      index: config['ES']['INDEX']['CROWDSAR'],
      body: pennyQueryBuilder.boardTimeline(data)
    }).then(function (response) {
      console.log('/getPostsTimelineData :: returned', response.aggregations.board_histogram.buckets.length);
      cb(null, response.aggregations.board_histogram.buckets);
    });
  }

  function getForumdata (data, cb) {
    console.log('getForumData', data);
    client.search({
      index: config['ES']['INDEX']['CROWDSAR'],
      body: pennyQueryBuilder.board(data)
    }).then(function (response) {
      console.log('/forumData :: returning', response.hits.hits.length);
      cb(null, _.pluck(response.hits.hits, '_source'));
      return;
    });
  }

  function getPvData (data, cb) {
    console.log('getPvData', data);
    client.search({
      index: config['ES']['INDEX']['PV'],
      body: {'size': 9999,
        'query': {
          'term': {
            'symbol': data.ticker.toLowerCase()
          }
        },
        'sort': { 'date': 'desc' }
      }
    }).then(function (response) {
      console.log('/pvData :: returning', response.hits.hits.length);
      cb(null, _.pluck(response.hits.hits, '_source'));
      return;
    });
  }

  // -- </Penny>

  function redflagScript (params, score) {
    return {
      'script': {
        'id': 'ernest',
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
        console.log('-- ', redflagLabel_[k](redFlagParams[k]));
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
        'sort': [
          {
            'date': {
              'order': 'asc'
            }
          }
        ],
        'query': {
          'match': {
            'symbol.cat': ticker.toLowerCase()
          }
        }
      };
    },
    'delinquency': function (cik) {
      return {
        '_source': ['form', 'date', '_enrich', 'url'],
        'sort': [
          {
            'date': {
              'order': 'desc'
            }
          }
        ],
        'query': {
          'terms': {
            'cik': [cik, cik.replace(/^0*/, '')] // Searching both widths
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
      'size': 15
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

  app.post('/company_table', function (req, res) {
    var d = req.body;
    console.log('d >> ', d);
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
    console.log('querying delinquency');
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
    console.log('financials <<', d);
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
    console.log('suspensions <<', d);
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

  // <Penny>
  // This is not being used

  //  app.post('/aggs', function (req, res) {
  //    client.search({
  //      index: 'crowdsar',
  //      body: pennyQueryBuilder.aggs(req.body),
  //      searchType: 'count',
  //      queryCache: true
  //    }).then(function (response) {
  //      res.send({
  //        'general': response.aggregations.significant_terms_general.buckets,
  //        'ents': response.aggregations.ents.buckets
  //      })
  //    })
  //  })

//  app.get('/coocurrence', function (req, res) {
//    var dateClause, boardClause, userClause
//    dateClause = {
//      'users': {
//        'range': {
//          'date': {
//            'gte': +new Date(req.date ? req.date[0] : '2001-01-01 00:00:00'),
//            'lte': +new Date(req.date ? req.date[1] : '2015-01-01 00:00:00')
//          }
//        }
//      },
//      'cooc': {
//        'range': {
//          'date': {
//            'lte': +new Date('2015-01-01 00:00:00') // Everything up until faux end date
//          }
//        }
//      }
//    }
//
//    // Filter boards
//    if (req.boardIds && req.boardIds.length > 0) {
//      boardClause = {
//        'terms': {
//          'board_id': rsplit(req.boardIds, ',')
//        }
//      }
//    }
//
//    // Filter users
//    if (req.userIds && req.userIds.length > 0) {
//      userClause = {
//        'terms': {
//          'user_id': rsplit(req.userIds, ',')
//        }
//      }
//    }
//
//    var query1 = {
//      'query': {
//        'bool': {
//          'must': _.filter([dateClause.users, boardClause, userClause])
//        }
//      },
//      'aggs': {
//        'users': {
//          'terms': {
//            'field': 'user_id',
//            'size': 75
//          }
//        }
//      }
//    }
//
//    client.search({
//      index: config.INDEX,
//      body: query1,
//      searchType: 'count',
//      queryCache: true
//    }).then(function (response1) {
//      var users = _.pluck(response1.aggregations.users.buckets, 'key')
//      var query2 = {
//        'query': {
//          'bool': {
//            'must': _.filter([dateClause.cooc,
//              { 'terms': { 'user_id': users } }])
//          }
//        },
//        'aggs': {
//          'by_user': {
//            'terms': {
//              'field': 'user.cat', // This can change over time, so this actually isn't the best method
//              'size': 75
//            },
//            'aggs': {
//              'by_board': {
//                'terms': {
//                  'field': config.AGG_FIELD,
//                  'size': config.ROUTES.N_BOARDS
//                }
//              }
//            }
//          }
//        }
//      }
//
//      client.search({
//        index: config.INDEX,
//        body: query2,
//        searchType: 'count',
//        queryCache: true
//      }).then(function (response2) {
//        var filteredUsers = _.filter(response2.aggregations.by_user.buckets, function (user1) {
//          return user1.by_board.buckets.length > config.ROUTES.THRESH
//        })
//        var out = _.map(filteredUsers, function (user1) {
//          var user1Boards = _.pluck(user1.by_board.buckets, 'key')
//          return {
//            'user1': user1.key,
//            'vals': _.map(filteredUsers, function (user2) {
//              var user2Boards = _.pluck(user2.by_board.buckets, 'key')
//              return _.intersection(user1Boards, user2Boards).length / _.union(user1Boards, user2Boards).length
//            })
//          }
//        })
//        // Make a call to R to format the adjacency matrix
//        request.post({
//          'url': config.R_IP,
//          'json': {
//            'fun': 'process',
//            'params': _.flatten(out)
//          },
//          'headers': { 'Expect': 'nothing' }
//        }, function (error, response, body) {
//          if (error) {
//            console.error(error)
//          } else {
//            res.send(body)
//          }
//        })
//      })
//    })
//  })
};

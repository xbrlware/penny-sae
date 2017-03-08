// server/node/boards.js

module.exports = function (app, config, client) {
  var async = require('async');
  var dateformat = require('dateformat');
  var lomap = require('lodash/map');
  var mapValues = require('lodash/mapValues');
  var sortBy = require('lodash/sortBy');
  var dropRight = require('lodash/dropRight');

  var logger = require('./logging');
  logger.level = 'debug';

  var boardQueryBuilder = {
    'board': function (brdData, search = null, users = false) {
      var q = {
        'size': 1000, // This limits the hits to 1000
        '_source': ['time', 'user_id', 'user', 'board_id', 'board', 'msg', 'msg_id', 'ticker', '__meta__.tri_pred'],
        'query': {
          'filtered': {
            'filter': {
              'bool': {
                'must': [
                  {
                    'range': {
                      'time': {
                        'gte': brdData.date_filter[0],
                        'lte': brdData.date_filter[1]
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      };
      if (brdData.sentiment.type === 'neg') {
        q.query.filtered.filter.bool.must.push({'range': {'__meta__.tri_pred.neg': {'gte': brdData.sentiment.score}}});
      } else if (brdData.sentiment.type === 'pos') {
        q.query.filtered.filter.bool.must.push({'range': {'__meta__.tri_pred.pos': {'gte': brdData.sentiment.score}}});
      } else if (brdData.sentiment.type === 'neut') {
        q.query.filtered.filter.bool.must.push({'range': {'__meta__.tri_pred.neut': {'gte': brdData.sentiment.score}}});
      }

      if (users) {
        q.query.filtered.filter.bool.must.push({
          'bool': {
            'must': [
              {'match': { '__meta__.sym.cik': brdData.cik }},
              {'terms': { 'user_id': brdData.users }}
            ]
          }
        });
      } else {
        q.query.filtered.filter.bool.must.push({
          'term': {
            '__meta__.sym.cik': brdData.cik
          }
        });
      }

      if (search) {
        lomap(search, function (s) {
          q.query.filtered.filter.bool.must.push(s);
        });
      }

      return q;
    },
    'boardTimeline': function (btData) {
      var bt = {
        'size': 0,
        'query': {
          'filtered': {
            'query': {
              'match': {
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

      if (btData.sentiment.type === 'neg') {
        bt.query.filtered['filter'] = {'range': {'__meta__.tri_pred.neg': {'gte': btData.sentiment.score}}};
      } else if (btData.sentiment.type === 'pos') {
        bt.query.filtered['filter'] = {'range': {'__meta__.tri_pred.pos': {'gte': btData.sentiment.score}}};
      } else if (btData.sentiment.type === 'neut') {
        bt.query.filtered['filter'] = {'range': {'__meta__.tri_pred.neut': {'gte': btData.sentiment.score}}};
      }
      return bt;
    },
    'getPVData': function (pvData) {
      return {
        'query': {
          'constant_score': {
            'filter': {
              'term': {
                'symbol': pvData.ticker.toLowerCase()
              }
            }
          }
        },
        'aggs': {
          'top_dates': {
            'terms': {
              'field': 'date',
              'size': 9999
            },
            'aggs': {
              'top_sort': {
                'top_hits': {
                  'sort': [
                    {'date': {'order': 'desc'}}
                  ],
                  '_source': {
                    'include': [
                      'date',
                      'open',
                      'high',
                      'low',
                      'close',
                      'volume'
                    ]
                  }
                }
              }
            }
          }
        }
      };
    },
    'timeline': function (tData, search) {
      var q = {
        'size': 0,
        'query': {
          'filtered': {
            'query': {
              'match': {
                '__meta__.sym.cik': tData.cik
              }
            }
          }
        },
        'aggs': {
          'posts': {
            'terms': {
              'field': 'user_id',
              'size': tData.query_size,
              'min_doc_count': tData.min_doc
            },
            'aggs': {
              'user': {
                'terms': {
                  'field': 'user.cat'
                }
              },
              'user_histogram': {
                'date_histogram': {
                  'field': 'time',
                  'interval': 'day',
                  'format': 'yyyy/MM/dd',
                  'min_doc_count': 1
                }
              },
              'stats': {
                'stats_bucket': {
                  'buckets_path': 'user_histogram>_count'
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

      var baseFilter = {'range': {'time': {'gte': tData.date_filter[0], 'lte': tData.date_filter[1]}}};

      if (tData.sentiment.type === 'neg') {
        q.query.filtered['filter'] = {'bool': {'must': [{'range': {'__meta__.tri_pred.neg': {'gte': tData.sentiment.score}}}, baseFilter]}};
      } else if (tData.sentiment.type === 'pos') {
        q.query.filtered['filter'] = {'bool': {'must': [{'range': {'__meta__.tri_pred.pos': {'gte': tData.sentiment.score}}}, baseFilter]}};
      } else if (tData.sentiment.type === 'neut') {
        q.query.filtered['filter'] = {'bool': {'must': [{'range': {'__meta__.tri_pred.neut': {'gte': tData.sentiment.score}}}, baseFilter]}};
      } else {
        q.query.filtered['filter'] = baseFilter;
      }

      if (search) {
        if (!q.query.filtered.filter.bool) {
          q.query.filtered['filter'] = {'bool': {'must': [baseFilter]}};
        }

        lomap(search, function (s) {
          q.query.filtered.filter.bool.must.push(s);
        });
      }

      return q;
    }
  };

  app.post('/user', function (req, res) {
    var d = req.body;
    if (!d.cik || !d.users || !d.date_filter) {
      return res.send([]);
    }
    var s = d.search_term !== '' ? hasSearch(d) : null;

    d.date_filter.map(function (dates, index) {
      d.date_filter[index] = dateformat(dates, 'yyyy-mm-dd HH:MM:ss');
    });

    logger.info('/user ::', d);

    client.search({
      index: config['ES']['INDEX']['CROWDSAR'],
      body: boardQueryBuilder.board(d, s, true),
      requestCache: true
    }).then(function (response) {
      var m = lomap(response.hits.hits, function (x) {
        if (x._source.time.indexOf('T') !== -1) {
          x._source.date = x._source.time.replace(/-/g, '/').split('T')[0];
        } else {
          x._source.date = x._source.time.replace(/-/g, '/');
        }
        return x._source;
      });
      res.send(m);
    });
  });

  app.post('/board', function (req, res) {
    var d = req.body;
    if (!d.cik || !d.date_filter || !d.ticker) {
      d = mapValues(d, function (value, key) {
        return value || '';
      });
    }

    if (d.ticker !== undefined && d.ticker.indexOf('.') !== -1) {
      d.ticker = d.ticker.split('.')[0];
    }

    async.parallel([
      function (cb) { getPvData(d, cb); },
      function (cb) { getPostsTimelineData(d, cb); }
    ], function (error, results) {
      if (error) { logger.debug(error); }
      res.send({
        'pvData': results[0],
        'ptData': results[1]
      });
    });
  });

  app.post('/redraw', function (req, res) {
    var d = req.body;
    if (!d.cik || !d.date_filter) {
      return res.send([]);
    }

    d.date_filter = lomap(d.date_filter, df => {
      if (df.indexOf('T') !== -1) {
        let temp = df.split('T');
        let day = temp[0];
        let hours = temp[1].split('.')[0];
        return day + ' ' + hours;
      } else {
        return df;
      }
    });

    logger.info('/redraw ::', d);

    async.parallel([
      function (cb) { getForumdata(d, cb); },
      function (cb) { getTimelineData(d, cb); }
    ], function (error, results) {
      if (error) { logger.debug(error); }
      res.send({
        'data': results[0],
        'tlData': results[1]
      });
    });
  });

  function hasSearch (data) {
    return [{
      'query': {
        'bool': {
          'must': {
            'match': {
              'msg': {
                'query': data.search_term,
                'operator': 'and'
              }
            }
          },
          'should': {
            'match_phrase': {
              'msg': {
                'query': data.search_term,
                'slop': 50
              }
            }
          }
        }
      }
    }];
  }

  function getTimelineData (data, cb) {
    var s = data.search_term !== '' ? hasSearch(data) : null;

    logger.info('getTimelineData', data);

    client.search({
      index: config['ES']['INDEX']['CROWDSAR'],
      body: boardQueryBuilder.timeline(data, s),
      requestCache: true
    }).then(function (response) {
      var q = lomap(response.aggregations.posts.buckets, function (x) {
        return {
          id: x.key,
          user: x.user.buckets[0].key,
          doc_count: x.stats.sum,
          pred_data: [
            {label: 'pos', value: x.pos.value},
            {label: 'neut', value: x.neut.value},
            {label: 'neg', value: x.neg.value}
          ],
          max: x.stats.max,
          mean: x.stats.avg,
          min: x.stats.min,
          timeline: x.user_histogram.buckets
        };
      });

      if (data.sort_field === 'pos' || data.sort_field === 'neg' || data.sort_field === 'neut') {
        q = sortBy(q, function (d) {
          return lomap(d.pred_data, function (x) {
            if (x.label === data.sort_field) {
              return x.value;
            }
          });
        });
      } else {
        q = sortBy(q, data.sort_field);
      }

      if (data.sort_type === 'desc') {
        q.reverse();
      }

      if (data.query_size === 0) {
        q = dropRight(q, (q.length - data.size));
      }

      logger.info('/getTimelineData :: returned', q.length);
      cb(null, q);
      return;
    });
  }

  function getPostsTimelineData (data, cb) {
    client.search({
      index: config['ES']['INDEX']['CROWDSAR'],
      body: boardQueryBuilder.boardTimeline(data),
      requestCache: true
    }).then(function (response) {
      logger.info('/getPostsTimelineData :: returning', response.aggregations.board_histogram.buckets.length);
      cb(null, lomap(response.aggregations.board_histogram.buckets, function (d, i) {
        if (d.key_as_string.indexOf('T') !== -1) {
          return {index: i, date: d.key_as_string.replace(/-/g, '/').split('T')[0], value: d.doc_count};
        } else {
          return {index: i, date: d.key_as_string.replace(/-/g, '/'), value: d.doc_count};
        }
      }));
    });
  }

  function getForumdata (data, cb) {
    var s = data.search_term !== '' ? hasSearch(data) : null;

    client.search({
      index: config['ES']['INDEX']['CROWDSAR'],
      body: boardQueryBuilder.board(data, s, false),
      requestCache: true
    }).then(function (response) {
      logger.info('/forumData :: returning', response.hits.hits.length);
      cb(null, lomap(response.hits.hits, function (x) {
        if (x._source.time.indexOf('T') !== -1) {
          x._source.date = x._source.time.replace(/-/g, '/').split('T')[0];
        } else {
          x._source.date = x._source.time.replace(/-/g, '/');
        }
        x._source.msg = x._source.msg.replace(/\(Read Entire Message\)/g, '(to be continued)');
        x._source.url = config['URL'] + x._source.msg_id;
        return x._source;
      }));
      return;
    });
  }

  function getPvData (data, cb) {
    client.search({
      index: config['ES']['INDEX']['PV'],
      body: boardQueryBuilder.getPVData(data)
    }).then(function (response) {
      logger.info('/pvData :: returning', response.hits.hits.length);
      cb(null, lomap(response.aggregations.top_dates.buckets, function (d) {
        return d.top_sort.hits.hits[0]._source;
      }));
      return;
    });
  }
};

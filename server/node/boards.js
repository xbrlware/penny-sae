// server/node/boards.js

module.exports = function (app, config, client) {
  var async = require('async');
  var lomap = require('lodash/map');
  var mapValues = require('lodash/mapValues');

  var boardQueryBuilder = {
    'board': function (brdData, search = null , users = false) {
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
            'filter': {
              'bool': {
                'must': [
                  {'term': {'__meta__.sym.cik': btData.cik}}
                ]
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
        bt.query.filtered.filter.bool.must.push({'range': {'__meta__.tri_pred.neg': {'gte': btData.sentiment.score}}});
      } else if (btData.sentiment.type === 'pos') {
        bt.query.filtered.filter.bool.must.push({'range': {'__meta__.tri_pred.pos': {'gte': btData.sentiment.score}}});
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
    'timeline': function (tData, search = null) {
      var q = {
        'size': 0,
        'query': {
          'filtered': {
            'filter': {
              'bool': {
                'must': [
                  {
                    'range': {
                      'time': {
                        'gte': tData.date_filter[0],
                        'lte': tData.date_filter[1]
                      }
                    }
                  },
                  {
                    'term': {
                      '__meta__.sym.cik': tData.cik
                    }
                  }
                ]
              }
            }
          }
        },
        'aggs': {
          'posts': {
            'terms': {
              'field': 'user_id',
              'size': tData.size
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
              'maximum': {
                'max_bucket': {
                  'buckets_path': 'user_histogram>_count'
                }
              },
              'minimum': {
                'min_bucket': {
                  'buckets_path': 'user_histogram>_count'
                }
              },
              'average': {
                'avg_bucket': {
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
      if (tData.sentiment.type === 'neg') {
        q.query.filtered.filter.bool.must.push({'range': {'__meta__.tri_pred.neg': {'gte': tData.sentiment.score}}});
      } else if (tData.sentiment.type === 'pos') {
        q.query.filtered.filter.bool.must.push({'range': {'__meta__.tri_pred.pos': {'gte': tData.sentiment.score}}});
      }
      if (search) {
        lomap(search, function (s) {
          q.query.filtered.filter.bool.must.push(s);
        });
      }
      return q;
    }
  };

  app.post('/user', function (req, res) {
    var d = req.body;
    console.log('/user ::', d);
    if (!d.cik || !d.users || !d.date_filter) {
      return res.send([]);
    }
    var s = d.search_term !== '' ? hasSearch(d) : null;

    client.search({
      index: config['ES']['INDEX']['CROWDSAR'],
      body: boardQueryBuilder.board(d, s, true)
    }).then(function (response) {
      var m = lomap(response.hits.hits, function (x) {
        x._source.date = x._source.time.replace(/-/g, '/').split('T')[0];
        return x._source;
      });
      res.send(m);
    });
  });

  app.post('/board', function (req, res) {
    var d = req.body;
    console.log('/board ::', d);
    if (!d.cik || !d.date_filter || !d.ticker) {
      d = mapValues(d, function (value, key) {
        if (!value) {
          value = '';
        }
        return value;
      });
    }

    if (d.ticker !== undefined && d.ticker.indexOf('.') !== -1) {
      d.ticker = d.ticker.split('.')[0];
    }

    async.parallel([
      function (cb) { getPvData(d, cb); },
      function (cb) { getPostsTimelineData(d, cb); }
    ], function (error, results) {
      if (error) { console.log(error); }
      res.send({
        'pvData': results[0],
        'ptData': results[1]
      });
    });
  });

  app.post('/redraw', function (req, res) {
    var d = req.body;
    console.log('/redraw ::', d);
    if (!d.cik || !d.date_filter) {
      return res.send([]);
    }
    async.parallel([
      function (cb) { getForumdata(d, cb); },
      function (cb) { getTimelineData(d, cb); }
    ], function (error, results) {
      if (error) { console.log(error); }
      res.send({
        'data': results[0],
        'tlData': results[1]
      });
    });
  });

  function hasSearch (data) {
    return [{
      'query': {
        'match': {
          'msg': {
            'query': data.search_term,
            'operator': 'and'
          }
        }
      }
    }];
  }

  function getTimelineData (data, cb) {
    var s = data.search_term !== '' ? hasSearch(data) : null;

    console.log('getTimelineData', data);

    client.search({
      index: config['ES']['INDEX']['CROWDSAR'],
      body: boardQueryBuilder.timeline(data, s)
    }).then(function (response) {
      var q = lomap(response.aggregations.posts.buckets, function (x) {
        return {
          id: x.key,
          user: x.user.buckets[0].key,
          doc_count: x.doc_count,
          pred_data: [
            {label: 'pos', value: x.pos.value},
            {label: 'neut', value: x.neut.value},
            {label: 'neg', value: x.neg.value}
          ],
          max: x.maximum.value,
          mean: x.average.value,
          min: x.minimum.value,
          timeline: x.user_histogram.buckets
        };
      });
      console.log('/getTimelineData :: returned', q.length);
      cb(null, q);
      return;
    });
  }

  function getPostsTimelineData (data, cb) {
    client.search({
      index: config['ES']['INDEX']['CROWDSAR'],
      body: boardQueryBuilder.boardTimeline(data)
    }).then(function (response) {
      console.log('/getPostsTimelineData :: returned', response.aggregations.board_histogram.buckets.length);
      cb(null, lomap(response.aggregations.board_histogram.buckets, function (d, i) {
        return {index: i, date: d.key_as_string.replace(/-/g, '/').split('T')[0], value: d.doc_count};
      }));
    });
  }

  function getForumdata (data, cb) {
    var s = data.search_term !== '' ? hasSearch(data) : null;

    client.search({
      index: config['ES']['INDEX']['CROWDSAR'],
      body: boardQueryBuilder.board(data, s, false)
    }).then(function (response) {
      console.log('/forumData :: returning', response.hits.hits.length);
      cb(null, lomap(response.hits.hits, function (x) {
        x._source.date = x._source.time.replace(/-/g, '/').split('T')[0];
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
      console.log('/pvData :: returning', response.hits.hits.length);
      cb(null, lomap(response.aggregations.top_dates.buckets, function (d) {
        return d.top_sort.hits.hits[0]._source;
      }));
      return;
    });
  }
};

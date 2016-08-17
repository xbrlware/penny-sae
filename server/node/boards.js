// server/node/boards.js

module.exports = function (app, config, client) {
  var async = require('async');
  var lomap = require('lodash/map');
  var maxBy = require('lodash/maxBy');
  var minBy = require('lodash/minBy');
  var meanBy = require('lodash/meanBy');
  var round = require('lodash/round');
  var mapValues = require('lodash/mapValues');

  var boardQueryBuilder = {
    'board': function (brdData, search = null , users = false) {
      var q = {
        'size': 1000, // This limits the hits to 1000
        '_source': ['time', 'user_id', 'user', 'board_id', 'board', 'msg', 'msg_id', 'ticker'],
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
        },
        'sort': {
          'time': 'desc'
        }
      };

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
    'getPVData': function (pvData) {
      return {
        'size': 9999,
        'query': {
          'constant_score': {
            'filter': {
              'term': {
                'symbol': pvData.ticker.toLowerCase()
              }
            }
          }
        },
        'sort': {
          'date': {'order': 'desc'}
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
                  'min_doc_count': 1
                },
                'aggs': {
                  'maximum': {
                    'max': {
                      'field': 'doc_count'
                    }
                  }
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
        var maxObj = maxBy(x.user_histogram.buckets, function (d) {
          return d.doc_count;
        });
        var minObj = minBy(x.user_histogram.buckets, function (d) {
          return d.doc_count;
        });
        return {
          id: x.key,
          user: x.user.buckets[0].key,
          doc_count: x.doc_count,
          pos: x.pos.value,
          neut: x.neut.value,
          neg: x.neg.value,
          max: maxObj.doc_count,
          mean: round(meanBy(x.user_histogram.buckets, function (d) {
            return d.doc_count;
          }), 1),
          min: minObj.doc_count,
          timeline: lomap(x.user_histogram.buckets, function (d) {
            var t = d.key_as_string.replace(/-/g, '/').split('T')[0];
            return {'key_as_string': t, 'doc_count': d.doc_count};
        })};
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
      cb(null, lomap(response.hits.hits, '_source'));
      return;
    });
  }
};

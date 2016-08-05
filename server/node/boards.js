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
    'board': function (brdData, search = null, users = false) {
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
    console.log('MORGAN :: ', d);

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

  // <Penny> This is not being used
/*
  app.post('/aggs', function (req, res) {
    client.search({
      index: 'crowdsar',
      body: boardQueryBuilder.aggs(req.body),
      searchType: 'count',
      queryCache: true
    }).then(function (response) {
      res.send({
        'general': response.aggregations.significant_terms_general.buckets,
        'ents': response.aggregations.ents.buckets
      });
    });
  });
*/
/*
  app.get('/coocurrence', function (req, res) {
    var boardClause;
    var userClause;
    var dateClause = {
      'users': {
        'range': {
          'date': {
            'gte': +new Date(req.date ? req.date[0] : '2001-01-01 00:00:00'),
            'lte': +new Date(req.date ? req.date[1] : '2015-01-01 00:00:00')
          }
        }
      },
      'cooc': {
        'range': {
          'date': {
            'lte': +new Date('2015-01-01 00:00:00') // Everything up until faux end date
          }
        }
      }
    };

    // Filter boards
    if (req.boardIds && req.boardIds.length > 0) {
      boardClause = {
        'terms': {
          'board_id': req.boardIds
        }
      };
    }

    // Filter users
    if (req.userIds && req.userIds.length > 0) {
      userClause = {
        'terms': {
          'user_id': req.userIds
        }
      };
    }

    var query1 = {
      'query': {
        'bool': {
          'must': _.filter([dateClause.users, boardClause, userClause])
        }
      },
      'aggs': {
        'users': {
          'terms': {
            'field': 'user_id',
            'size': 75
          }
        }
      }
    };

    client.search({
      index: config.INDEX,
      body: query1,
      searchType: 'count',
      queryCache: true
    }).then(function (response1) {
      var users = _.pluck(response1.aggregations.users.buckets, 'key');
      var query2 = {
        'query': {
          'bool': {
            'must': _.filter([dateClause.cooc,
                { 'terms': { 'user_id': users } }])
          }
        },
        'aggs': {
          'by_user': {
            'terms': {
              'field': 'user.cat', // This can change over time, so this actually isn't the best method
              'size': 75
            },
            'aggs': {
              'by_board': {
                'terms': {
                  'field': config.AGG_FIELD,
                  'size': config.ROUTES.N_BOARDS
                }
              }
            }
          }
        }
      };

      client.search({
        index: config.INDEX,
        body: query2,
        searchType: 'count',
        queryCache: true
      }).then(function (response2) {
        var filteredUsers = _.filter(response2.aggregations.by_user.buckets, function (user1) {
          return user1.by_board.buckets.length > config.ROUTES.THRESH;
        });
        var out = _.map(filteredUsers, function (user1) {
          var user1Boards = _.pluck(user1.by_board.buckets, 'key');
          return {
            'user1': user1.key,
            'vals': _.map(filteredUsers, function (user2) {
              var user2Boards = _.pluck(user2.by_board.buckets, 'key');
              return _.intersection(user1Boards, user2Boards).length / _.union(user1Boards, user2Boards).length;
            })
          };
        });
        // Make a call to R to format the adjacency matrix
        request.post({
          'url': config.R_IP,
          'json': {
            'fun': 'process',
            'params': _.flatten(out)
          },
          'headers': { 'Expect': 'nothing' }
        }, function (error, response, body) {
          if (error) {
            console.error(error);
          } else {
            res.send(body);
          }
        });
      });
    });
  });
*/
};

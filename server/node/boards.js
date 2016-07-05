// server/node/boards.js

module.exports = function (app, config, client) {
  var _ = require('underscore')._;
  var async = require('async');

  var boardQueryBuilder = {
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
              'match': {
                '__meta__.sym.cik': brdData.cik
              }
            }
          }
        }
      };
    },
    'boardTimeline': function (btData) {
      return {
        'size': 0,
        'query': {
          'match': {
            '__meta__.sym.cik': btData.cik
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
              'size': 10
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
  };

  app.post('/user', function (req, res) {
    var d = req.body;
    console.log('/user ::', d);
    if (!d.cik || !d.users || !d.date_filter) {
      return res.send([]);
    }
    client.search({
      index: config['ES']['INDEX']['CROWDSAR'],
      body: boardQueryBuilder.user(d)
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
      body: boardQueryBuilder.timeline(data)
    }).then(function (response) {
      var q = _.map(response.aggregations.posts.buckets, function (x) {
        return {id: x.key,
          user: x.user.buckets[0].key,
          doc_count: x.doc_count,
          pos: x.pos.value,
          neut: x.neut.value,
          neg: x.neg.value,
        timeline: x.user_histogram.buckets};
      });
      // this orders the top 10 users by posts in penny
      var r = _.sortBy(q, function (x) { return x.doc_count; }).reverse();
      console.log('/getTimelineData :: returned', r.length);
      cb(null, r);
      return;
    });
  }

  function getPostsTimelineData (data, cb) {
    console.log('getPostsTimelineData', data);
    client.search({
      index: config['ES']['INDEX']['CROWDSAR'],
      body: boardQueryBuilder.boardTimeline(data)
    }).then(function (response) {
      console.log('/getPostsTimelineData :: returned', response.aggregations.board_histogram.buckets.length);
      cb(null, response.aggregations.board_histogram.buckets);
    });
  }

  function getForumdata (data, cb) {
    console.log('getForumData', data);
    client.search({
      index: config['ES']['INDEX']['CROWDSAR'],
      body: boardQueryBuilder.board(data)
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
      body: {'size': 9999, 'query': {'term': {'symbol': data.ticker.toLowerCase()}}}
    }).then(function (response) {
      console.log('/pvData :: returning', response.hits.hits.length);
      cb(null, _.pluck(response.hits.hits, '_source'));
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
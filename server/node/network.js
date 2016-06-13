var _ = require('underscore')._;
var async = require('async');

const MAX_NEIGHBORS = 100;

function zpad (x, n) {
  n = n | 10;
  if (x.length < n) {
    return zpad('0' + x, n);
  } else {
    return x;
  }
}

function edges2nodes (edges) {
  var nodes = [];
  _.map(edges, function (edge) {
    if (!_.findWhere(nodes, {'id': edge['issuerCik']})) {
      nodes.push({
        'id': edge['issuerCik'],
        'name': edge['issuerName'],
        'role': new Set(['issuer'])
      });
    } else {
      _.findWhere(nodes, {'id': edge['issuerCik']})['role'].add('issuer');
    }

    if (!_.findWhere(nodes, {'id': edge['ownerCik']})) {
      nodes.push({
        'id': edge['ownerCik'],
        'name': edge['ownerName'],
        'role': new Set(['owner'])
      });
    } else {
      _.findWhere(nodes, {'id': edge['ownerCik']})['role'].add('owner');
    }
  });
  return nodes;
}

// >>
// Duplicate from routes.js -- should refactor
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
// <<

module.exports = function (app, config, client) {
  function formatRedFlagResponse (response, nodes) {
    return _.chain(response.responses)
      .zip(nodes)
      .filter(function (tuple) {return tuple[0].hits.total > 0;})
      .map(tuple => {
        var redFlags = _.chain(tuple[0]['hits']['hits'])
          .map((hit) => hit['fields']['redFlags'][0])
          .filter(function (rf) {return _.keys(rf).length > 0;})
          .value();

        return {
          'id': tuple[1]['id'],
          'name': tuple[1]['name'],
          'data': {
            'is_issuer': tuple[1].role.has('issuer'),
            'redFlags': reduceRedFlags(redFlags)
          }
        };
      })
      .filter((x) => x)
      .value();
  }

  function reduceRedFlags (redFlags) {
    var raw = _.reduce(redFlags, (a, b) => {
      _.map(a, (v, k) => {
        _.map(v, (vv, kk) => {
          if(!b[k]) {
            b[k] = {}
            b[k][kk] = vv;
          } else {
            b[k][kk] += vv;
          }
        });
      });
      return b;
    }, {});
    
    var n_neighbors = redFlags.length;
    var n_redFlags_computed = _.keys(redFlags[0]).length;
    var total_redFlags_hit = _.chain(raw).pluck('is_flag').reduce((a, b) => a + b, 0).value();
    var avg_redFlags_hit = total_redFlags_hit / n_neighbors;

    return {
      'raw': raw,
      'total': avg_redFlags_hit,
      'possible': n_redFlags_computed * n_neighbors
    };
  }

  function computeIssuerRedFlags (nodes, redFlagParams, cb) {
    if (!nodes.length) {return cb([]);}

    client.msearch({
      'index': config['ES']['INDEX']['AGG'],
      'body': _.chain(nodes).map((node) => {
        return [
          {},
          {
            'size': 1,
            '_source': false,
            'query': {'terms': {'cik': [node.id]}},
            'script_fields': {'redFlags': redflagScript(redFlagParams, false)}
          }
        ];
      }).flatten().value()
    }).then((response) => {
      cb(formatRedFlagResponse(response, nodes));
    }).catch(function (err) {console.log(err.stack);});
  }

  function computeOwnerRedFlags (nodes, redFlagParams, cb) {
    if (!nodes.length) {return cb([]);}
    client.msearch({
      'index': config['ES']['INDEX']['OWNERSHIP'],
      'body': _.chain(nodes).map((node) => {
        return [
          {},
          {
            'size': 0,
            'query': {
              'filtered': {
                'filter': {
                  'or': [
                    { 'term': { 'ownerCik': node.id } }
                  ]
                }
              }
            },
            'aggs': {
              'issuerCiks': {
                'terms': {'field': 'issuerCik', 'size': 100}
              }
            }
          }
        ];
      }).flatten().value()
    }).then(function (response) {
      var neighbor_queries = _.chain(response.responses).map((r) => {
        return _.pluck(r['aggregations']['issuerCiks']['buckets'], 'key');
      }).map((ciks) => {
        return [{}, {
          'size': 100,
          'query': {'terms': {'cik': ciks}},
          'script_fields': {'redFlags': redflagScript(redFlagParams, false)}
        }];
      }).flatten().value();

      client.msearch({
        'index': config['ES']['INDEX']['AGG'],
        'body': neighbor_queries
      }).then((response) => {
        cb(formatRedFlagResponse(response, nodes));
      }).catch(function (err) {console.log(err.stack);});
    }).catch(function (err) {console.log(err.stack);});
  }

  function computeRedFlags (nodes, redFlagParams, cb) {
    var issuers = _.filter(nodes, (node) => node.role.has('issuer'));
    computeIssuerRedFlags(issuers, redFlagParams, function (issuerRedFlags) {
      var owners = _.filter(nodes, (node) => !node.role.has('issuer'));
      computeOwnerRedFlags(owners, redFlagParams, (ownerRedFlags) => {
        cb(issuerRedFlags.concat(ownerRedFlags));
      });
    });
  }

  function neighbors (params, cb) {
    query = {'term': {}};
    query['term'][`${params.source}Cik`] = params.cik;

    client.search({
      'index': config['ES']['INDEX']['OWNERSHIP'],
      'body': {
        'size': MAX_NEIGHBORS,
        'query': query
      }
    }).then(function (response) {
      cb(
        false,
        _.map(response.hits.hits, function (hit) {
          return {
            'issuerCik': hit['_source']['issuerCik'],
            'issuerName': hit['_source']['issuerName'],
            'ownerCik': hit['_source']['ownerCik'],
            'ownerName': hit['_source']['ownerName']
          };
        })
      );
    }).catch(function (err) {console.log(err.stack);});
  }

  app.post('/network', function (req, res) {
    var d = req.body;
    var cik = zpad(d.cik.toString());
    var redFlagParams = d.redFlagParams;
    console.log('/network ::', d);

    async.parallel([
      function (cb) { neighbors({ 'cik': cik, 'source': 'issuer', 'target': 'owner'  }, cb); },
      function (cb) { neighbors({ 'cik': cik, 'source': 'owner',  'target': 'issuer' }, cb); }
    ], function (err, results) {
      var edges = _.chain([results]).flatten().value();
      var nodes = edges2nodes(edges);
      computeRedFlags(nodes, redFlagParams, function (nodes) {
        console.log('/network :: returning', nodes, edges);
        res.send({'nodes': nodes, 'edges': edges});
      });
    });
  });
};

var _ = require('underscore')._,
  async = require('async');

const MAX_NEIGHBORS = 100;
const INDEX = 'ownership';

function zpad (x, n) {
  n = n | 10;
  if (x.length < n) {
    return zpad('0' + x, n);
  } else {
    return x;
  }
}

// Should reword this into a `reduce` type step.
// Actually probably have to send an edgelist to the front end

module.exports = function (app, config, client) {
  function neighbors (params, cb) {
    query = {'term': {}};
    query['term'][`${params.source}Cik`] = params.cik;
    client.search({
      'index': 'ernest_ownership',
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
            'ownerCik': hit['_source']['ownerCik']
          };
        })
      );
    });
  }

  app.post('/network', function (req, res) {
    var d = req.body;
    var cik = zpad(d.cik.toString());
    console.log('network :: cik', cik);

    async.parallel([
      function (cb) { neighbors({ 'cik': cik, 'source': 'issuer', 'target': 'owner'  }, cb); },
      function (cb) { neighbors({ 'cik': cik, 'source': 'owner',  'target': 'issuer' }, cb); }
    ], function (err, edges) {
      var nodes = _.chain(edges)
        .flatten()
        .map(function (edge) {return _.values(edge);})
        .flatten()
        .uniq()
        .map(function (cik) { return {'id': cik, 'name': cik};})
        .value();

      var edges = _.chain(edges).flatten().value();

      res.send({'nodes': nodes, 'edges': edges});
    });
  });
};

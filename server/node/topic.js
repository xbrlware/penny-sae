module.exports = function (app, config, client) {
  var async = require('async');
  var _ = require('underscore')._;
  var queryBuilder = require('./queryBuilder')(config);

  function time_series (query, cb) {
    // Given a search string, return histogram of mentions over time
    client.search({
      'index': config['ES']['INDEX']['CROWDSAR'],
      'body': {
        'query': {'match_phrase': {'msg': query}},
        'aggs': {'date_histogram': {'date_histogram': {'field': 'time', 'interval': 'week'}}}
      },
      'from': 0,
      'size': 0,
      'requestCache': true
    }).then(function (esResponse) {
      cb(undefined, {
        'date_histogram': _.map(esResponse.aggregations.date_histogram.buckets, (x) => {
          return {
            'time': x['key'],
            'doc_count': x['doc_count']
          };
        })
      });
    });
  }

  function sic_distribution (query, cb) {
    // Given a search string, return histogram of associated SIC numbers

    // (*) Right now, this is going to return multiple SICs for a single company, since
    // companies appear multiple times in SYMBOLOGY
    client.search({
      'index': config['ES']['INDEX']['CROWDSAR'],
      'body': queryBuilder.topic.cik(query, size = 500),
      'from': 0,
      'size': 0,
      'requestCache': true
    }).then(function (esResponse) {
      var ciks = _.pluck(esResponse.aggregations.ciks.buckets, 'key');
      client.search({
        'index': config['ES']['INDEX']['SYMBOLOGY'],
        'body': queryBuilder.topic.sic_histogram(ciks),
        'from': 0,
        'size': 0,
        'requestCache': true
      }).then(function (esResponse2) {
        cb(undefined, {'sic_histogram': esResponse2.aggregations.sics.buckets});
      });
    });
  }

  app.post('/topic_summary', function (req, res) {
    var d = req.body;

    async.parallel([
      function (cb) { time_series(d.query, cb); },
      function (cb) { sic_distribution(d.query, cb); }
    ], function (err, results) {
      if (err) { console.error(err); }
      res.send(_.reduce(results, function (a, b) {return _.extend(a, b);}, {}));
    });
  });
};

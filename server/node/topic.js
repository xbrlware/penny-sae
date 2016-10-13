module.exports = function (app, config, client) {
  var async = require('async');
  var _ = require('underscore')._;
  var queryBuilder = require('./queryBuilder')(config);

  var logger = require('./logging');
  logger.level = 'debug';

  function timeSeries (query, cb) {
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

  function sicDistribution (query, cb) {
    // Given a search string, return histogram of associated SIC numbers

    // (*) Right now, this is going to return multiple SICs for a single company, since
    // companies appear multiple times in SYMBOLOGY
    // ^^ In the process of fixing this
    var size = 500;
    client.search({
      'index': config['ES']['INDEX']['CROWDSAR'],
      'body': queryBuilder.topic.cik(query, size),
      'from': 0,
      'size': 0,
      'requestCache': true
    }).then(function (esResponse) {
      var ciks = _.pluck(esResponse.aggregations.ciks.buckets, 'key');
      client.search({
        'index': config['ES']['INDEX']['AGG'],
        'body': queryBuilder.topic.sic_histogram(ciks),
        'from': 0,
        'size': 0,
        'requestCache': true
      }).then(function (esResponse) {
        cb(undefined, {'sic_histogram': esResponse.aggregations.sics.buckets});
      });
    });
  }

  app.post('/topic_summary', function (req, res) {
    var d = req.body;
    logger.info('topic_summary ->', d.query);
    async.parallel([
      function (cb) { timeSeries(d.query, cb); },
      function (cb) { sicDistribution(d.query, cb); }
    ], function (err, results) {
      if (err) { logger.debug(err); }
      res.send(_.reduce(results, function (a, b) { return _.extend(a, b); }, {}));
    });
  });
};

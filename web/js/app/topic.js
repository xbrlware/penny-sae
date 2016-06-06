// web/js/app/topic.js

/* global Ember, App */

// Topic View

App.Topic = Ember.Object.extend({
  cd_last: undefined,
  rf_total: undefined,
  rf_possible: undefined,
  count: undefined,
  agg: undefined,
  unknownNames: undefined,
  searchTerm_topic: undefined,

  pct_any: function () {
    var pct = this.get('rf_any') / this.get('count');
    return Math.round(pct * 100);
  }.property('rf_any', 'count'),

  agg_redflag: function () {
    var key = {
      'pv': 'Price/Volume',
      'trading_halts': 'Trading Halts',
      'symbology': 'Change in Business',
      'financials': 'No Revenues',
      'otc_neighbors': 'OTC Associates',
      'delinquency': 'Late Filings'
    };

    var agg = this.get('agg');
    var redflag = [];
    agg.map(function (x) {
      if (x[0].indexOf('_redflag') >= 0) {
        x[0] = x[0].split('_redflag').slice(0, -1);
        x[0] = key[x[0]];
        redflag.push(x);
      }
    });
    return redflag;
  }.property('agg')
});

App.Topic.reopenClass({
  make: function (tss, st, unknownNames) {
    var topic = App.Topic.create();
    Object.keys(tss).map(function (k) {
      topic.set(k, tss[k]);
    });
    topic.set('searchTerm_topic', st);
    topic.set('unknownNames', unknownNames);
    return topic;
  }
});

App.TopicRoute = Ember.Route.extend({
  needs: ['application', 'sidebar'],
  model: function () {
    var mod = this.controllerFor('sidebar').get('model');
    var tss = mod.get('tss');
    var unknownNames = mod.get('unknownNames');
    var st = this.controllerFor('application').get('searchTerm_topic');
    return App.Topic.make(tss, st, unknownNames);
  }
});

App.TopicView = Ember.View.extend({
  templateName: 'topic'
});

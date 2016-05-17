// web/js/app/topic.js

// Topic View

App.Topic = Ember.Object.extend({
  cd_last: undefined,
  rf_total: undefined,
  rf_possible: undefined,
  count: undefined,
  agg: undefined,
  unknown_names: undefined,
  searchTerm_topic: undefined,

  pct_any: function () {
    var pct = this.get('rf_any') / this.get('count')
    return Math.round(pct * 100)
  }.property('rf_any', 'count'),

  agg_redflag: function () {
    var key = {
      'pv': 'Price/Volume',
      'trading_halts': 'Trading Halts',
      'delta': 'Change in Business',
      'financials': 'No Revenues',
      'network': 'OTC Associates',
      'delinquency': 'Late Filings'
    }

    agg = this.get('agg')
    redflag = []
    agg.map(function (x) {
      if (x[0].indexOf('_redflag') >= 0) {
        x[0] = x[0].split('_redflag').slice(0, -1)
        x[0] = key[x[0]]
        redflag.push(x)
      }
    })
    return redflag
  }.property('agg')
})

App.Topic.reopenClass({
  make: function (tss, st, unknown_names) {
    topic = App.Topic.create()
    Object.keys(tss).map(function (k) {
      topic.set(k, tss[k])
    })
    topic.set('searchTerm_topic', st)
    topic.set('unknown_names', unknown_names)
    return topic
  }
})

App.TopicRoute = Ember.Route.extend({
  needs: ['application', 'sidebar'],
  model: function () {
    mod = this.controllerFor('sidebar').get('model')
    tss = mod.get('tss')
    unknown_names = mod.get('unknown_names')
    st = this.controllerFor('application').get('searchTerm_topic')
    return App.Topic.make(tss, st, unknown_names)
  }
})

App.TopicView = Ember.View.extend({
  templateName: 'topic'
})

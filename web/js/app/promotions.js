// web/js/app/promotions.js

App.PromotionsRoute = Ember.Route.extend({
  model: function () {
    var src = this.modelFor('detail').get('source')
    var promotions = src['promotions']
    console.log('************* promotions', promotions)
    return promotions
  }
})

App.PromotionsView = Ember.View.extend({
  templateName: 'promotions',
  didInsertElement: function () {
    var mod = this.get('controller').get('model')
    console.log('promotions mod', mod)
    this.render_promotion_chart(mod)
  },
  render_promotion_chart: function (mod) {
    console.log('rendering promotion chart', mod)

    start = _.min(mod, function (x) {return x.date})
    console.log('start', start)

    data = {}
    key = new Date().getTime() / 1000
    _.map(mod, function (x) {
      key = new Date(x.date).getTime() / 1000
      start = key < start ? key : start
      data[key] = x.cnt
    })

    var cal = new CalHeatMap()
    if (data.length > 0) {
      cal.init({
        data: data,
        start: new Date(start * 1000),
        range: 12 * (new Date().getYear() - new Date(start * 1000).getYear()),
        domain: 'month',
        subDomain: 'day',
        scale: [1, 2, 4, 8],
        itemName: ['promotion', 'promotions'],
        displayScale: false
      })
    }
  }
})

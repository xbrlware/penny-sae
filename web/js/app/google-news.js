// web/js/app/google-news.js

// Google News

App.GoogleNewsRoute = Ember.Route.extend({
  beforeModel: function (args) {
    try {
      console.log(args.params.omxNews.omx)
    } catch(err) {
      this.transitionTo('subNews')
    }
  },
  model: function () {
    var cik = this.modelFor('detail').get('cik')
    console.log('downloading omx ids for cik', cik)
    return App.Search.search_omx(cik)
  }
})

/*
   App.GoogleNewsView = Ember.View.extend({
   didInsertElement : function() {
   $('.li-omx').click(function(e) {
   $('.li-omx').css('background-color', 'white')
   $(this).css('background-color', 'whiteSmoke')
   })
   }
   })
   */

App.SubNewsRoute = Ember.Route.extend({
  model: function () {
    var currentName = this.modelFor('detail').get('currentName')
    console.log(' ************ google news current name', currentName)
    return 'cse.html?q="' + currentName + '"'
  }
})

App.NewsView = Ember.View.extend({
  classNames: ['news'],

  controllerChanged: function () {
    this.rerender()
  }.observes('value'),

  render: function (buffer) {
    console.log('this value', this.get('value'))
    buffer.push('<iframe id="cse-iframe" src=\'' +
      this.get('value') + '\'}} frameborder="0"></iframe>')
  },

  willInsertElement: function () {
    Ember.$.support.cors = true
    Ember.$('#google-news').load('html/cse.html')
  }
})

App.OmxNewsRoute = Ember.Route.extend({
  model: function (params) {
    console.log('params', params)
    return App.Search.fetch_omx(params.omx)
  }
})

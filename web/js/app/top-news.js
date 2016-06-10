// web/js/app/top-news.js

/* global Ember, App */

// --

App.TopNewsRoute = Ember.Route.extend({
  beforeModel: function (args) {
    this.transitionTo('subNews');
  },
  setupController: function (controller, model) {
    App.Search.fetch_data('omx', this.get('controller.name')).then(function (response) {
      controller.set('model', response.data);
    });
  }
});

App.TopNewsController = Ember.Controller.extend({
  needs: ['detail'],
  name: Ember.computed.alias('controllers.detail.model')
});

// --

App.SubNewsRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    controller.set('model', 'cse.html?q="' + controller.get('name.name') + '"');
  }
});

App.SubNewsController = Ember.Controller.extend({
  needs: ['detail'],
  name: Ember.computed.alias('controllers.detail.model')
});

App.NewsView = Ember.View.extend({
  classNames: ['news'],

  controllerChanged: function () {
    this.rerender();
  }.observes('value'),

  render: function (buffer) {
    console.log('this value', this.get('value'));
    buffer.push('<iframe id="cse-iframe" src=\'' +
      this.get('value') + '\'}} frameborder="0"></iframe>');
  },

  willInsertElement: function () {
    Ember.$.support.cors = true;
    Ember.$('#google-news').load('html/cse.html');
  }
});

// --

App.OmxNewsRoute = Ember.Route.extend({
  model: function (params) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      App.Search.fetch_data('omx_body', {'article_id': params.article_id}).then(function (response) {
        resolve(response.data);
      });
    });
  }
});

// web/js/app/top-news.js

/* global Ember, App */

App.TopNewsRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    var _this = this;
    App.Search.fetch_data('omx', {cik: this.get('controller.name').cik, search: null}).then(
      function (response) {
        controller.set('model', response.data);
        if (response.data.length > 0) {
          _this.transitionTo('omxNews', response.data[0].id);
        } else {
          _this.transitionTo('topNews');
        }
      }
    );
  }
});

App.TopNewsController = Ember.Controller.extend({
  needs: ['detail'],
  name: Ember.computed.alias('controllers.detail.model'),
  setModel: function (sw) {
    var _this = this;
    App.Search.fetch_data('omx', {cik: this.get('name').cik, search: sw}).then(
      function (response) {
        _this.set('model', response.data);
        if (response.data.length > 0) {
          _this.transitionTo('omxNews', response.data[0].id);
        } else {
          _this.transitionTo('topNews');
        }
      }
    );
  },

  actions: {
    newsSearch: function (searchWord) {
      this.setModel(searchWord);
    }
  }
});

App.OmxNewsRoute = Ember.Route.extend({
  model: function (params) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      App.Search.fetch_data('omx_body', {'article_id': params.article_id}).then(function (response) {
        resolve(response.data);
      });
    });
  }
});

// web/js/app/routes/top-news.js
/* global Ember, App */

'use strict';

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

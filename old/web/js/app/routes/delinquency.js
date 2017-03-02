// web/js/app/routes/delinquency.js
/* global Ember, App */

'use strict';

App.DelinquencyRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    App.Search.fetch_data('delinquency', this.get('controller.name')).then(function (response) {
      controller.set('model', response.data);
    });
  }
});

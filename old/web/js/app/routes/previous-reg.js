// web/js/app/previous-reg.js
/* global Ember, App */

'use strict';

App.PreviousRegRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    App.Search.fetch_data('suspensions', controller.get('name')).then(function (response) {
      controller.set('model', response.data);
      controller.set('have_records', response.data.length > 0);
    });
  }
});

// web/js/app/routes/detail.js
/* global Ember, App */

'use strict';

App.DetailRoute = Ember.Route.extend({
  model: function (params) {
    return App.Search.fetch_data('cik2name', {'cik': params.cik});
  },

  setupController: function (controller, model, queryParams) {
    controller.set('model', model);
  }
});

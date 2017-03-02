// web/js/app/routes/financials.js

/* global Ember, App */

App.FinancialsRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    App.Search.fetch_data('financials', this.get('controller.name')).then(function (response) {
      controller.set('model', response.data);
    });
  }
});

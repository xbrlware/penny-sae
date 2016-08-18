// web/js/app/summary.js

/* global Ember, App */

App.SummaryRoute = Ember.Route.extend({
  setupController: function (controller, model, queryParams) {
    App.Search.fetch_data('topic_summary', {query: controller.get('searchTerm')}).then(function (response) {
      console.log('summary response -- ', response);
      controller.set('model', response);
    });
  }
});

App.SummaryController = Ember.ObjectController.extend({
  needs: ['application'],
  searchTerm: Ember.computed.alias('controllers.application.searchTerm')
});

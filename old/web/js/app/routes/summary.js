// web/js/app/summary.js
/* global Ember, App */

'use strict';

App.SummaryRoute = Ember.Route.extend({
  setupController: function (controller, model, queryParams) {
    App.Search.fetch_data('topic_summary', {query: controller.get('searchTerm') || ''}).then(function (response) {
      controller.set('model', response);
      controller.drawDateHistogram();
      controller.drawSicHistogram();
    });
  }
});

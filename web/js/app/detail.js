// web/js/app/detail.js

/* global Ember, App */

App.DetailRoute = Ember.Route.extend({
  model: function (params) {
    return App.Search.fetch_data('cik2name', {'cik': params.cik});
  },

  setupController: function (controller, model, queryParams) {
    controller.set('model', model);
  }
});

App.DetailController = Ember.ObjectController.extend({
  needs: ['application'],
  redFlagParams: Ember.computed.alias('controllers.application.redFlagParams')
});

App.DetailView = Ember.View.extend({
  controllerChanged: function () { Ember.$('html, body').animate({ scrollTop: 0 }, '500', 'swing'); }.observes('controller.model'),
  didInsertElement: function () { this.$().hide().fadeIn('slow'); }
});

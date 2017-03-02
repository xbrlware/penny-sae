// web/js/app/routes/associates.js
/* global Ember, App */

'use strict';

App.AssociatesRoute = Ember.Route.extend({
  setupController: function (controller) {
    controller.set('model', this.modelFor('detail'));
    controller.controllerChanged();
  }
});

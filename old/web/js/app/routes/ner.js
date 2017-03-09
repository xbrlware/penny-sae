// web/js/app/routes/ner.js
/* global Ember, App */

'use strict';

App.NerRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    var cik = this.modelFor('detail').get('cik');
    controller.set('cik', cik);
  }
});

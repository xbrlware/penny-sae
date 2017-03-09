// web/js/app/routes/front-page.js
/* global App */

'use strict';

App.FrontpageRoute = App.GRoute.extend({
  setupController: function (controller, model) {
    this.controllerFor('application').set('showNav', false);
  }
});

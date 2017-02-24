// web/js/app/controllers/front-page.js

/* global Ember, App */

'use strict';

App.FrontpageController = Ember.ObjectController.extend({
  needs: ['application'],
  redFlagParams: Ember.computed.alias('controllers.application.redFlagParams'),
  isAdmin: function () { return App.isAdmin(); }.property()
});


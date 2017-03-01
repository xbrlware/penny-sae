// web/js/app/controller/detail.js
/* global Ember, App */

'use strict';

App.DetailController = Ember.Controller.extend({
  needs: ['application'],
  redFlagParams: Ember.computed.alias('controllers.application.redFlagParams')
});


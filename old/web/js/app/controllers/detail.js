// web/js/app/controller/detail.js
/* global Ember, App */

'use strict';

App.DetailController = Ember.Controller.extend({
  application: Ember.inject.controller(),
  redFlagParams: Ember.computed.alias('controllers.application.redFlagParams')
});


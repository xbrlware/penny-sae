// web/js/app/login.js

/* global Ember, App */

'use strict';

App.LoginView = Ember.View.extend({
  didInsertElement: function () {
    Ember.$('#input-username').focus();
  }
});


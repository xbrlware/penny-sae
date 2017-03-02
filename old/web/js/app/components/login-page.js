// web/js/app/components/login-page.js

/* global Ember, App */

'use strict';

App.LoginPageComponent = Ember.Component.extend({
  didInsertElement: function () {
    Ember.$('#input-username').focus();
  },
  actions: {
    authenticate () {
      this.sendAction('authenticate');
    }
  }
});

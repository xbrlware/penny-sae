// web/js/app/routes/login.js

/* global Ember, App */

'use strict';

App.LoginPageRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    if (this.get('session.isAuthenticated')) {
      this.transitionTo('frontpage');
    } else {
      controller.set('errorMessage', null);
    }
  }
});


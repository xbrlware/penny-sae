// web/js/app/login.js

/* global Ember, App, SimpleAuth, config */

App.LoginRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    if (this.get('session.isAuthenticated')) {
      this.transitionTo('frontpage');
    } else {
      controller.set('errorMessage', null);
    }
  }
});

App.LoginController = Ember.Controller.extend(SimpleAuth.LoginControllerMixin, {
  authenticator: 'authenticator:custom',
  show_login: true,
  actions: {
    authenticate: function () {
      var _this = this;
      this._super().then(null, function (message) {
        _this.set('errorMessage', message);
      });
    }
  }
});

App.LoginView = Ember.View.extend({
  didInsertElement: function () {
    Ember.$('#input-username').focus();
  }
});

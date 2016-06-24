// web/js/app/login.js

/* global Ember, App, SimpleAuth, config */

App.LoginRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    if (this.get('session.isAuthenticated')) {
      console.log('$$$ auth: already authenticated...');
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
      console.log('$$$ auth: start');
      var _this = this;
      this._super().then(null, function (message) {
        console.log('$$$ auth: finish w/ message:', message);
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

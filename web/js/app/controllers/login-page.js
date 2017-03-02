// web/js/app/controllers/login.js

/* global Ember, App, SimpleAuth */

App.LoginPageController = Ember.Controller.extend(SimpleAuth.LoginControllerMixin, {
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

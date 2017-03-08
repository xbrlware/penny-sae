// app/components/login-page.js

import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service(),
  init: function () {
    this._super(...arguments);
    if (this.get('session').isAuthenticated) {
      this.get('router').transitionTo('frontpage');
    }
  },
  errorMessage: undefined,
  show_login: true,
  didInsertElement () {
    Ember.$('#input-username').focus();
  },
  actions: {
    authenticate () {
      const _this = this;
      let { identification, password } = this.getProperties('identification', 'password');
      let authenticator = 'authenticator:custom';
      this.get('session').authenticate(authenticator, identification, password).then(function () {
        _this.get('router').transitionTo('frontpage');
      }, function (error) {
        _this.set('errorMessage', error);
      });
    }
  }
});

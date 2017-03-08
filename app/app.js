import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver,

  // Global getters for localstorage
  isAdmin: function () {
    return window.localStorage.getItem('isAdmin') === 'true';
  },
  username: function () {
    return window.localStorage.getItem('username');
  },
  token: function () {
    return window.localStorage.getItem('token');
  },

  saveToken: function (token, isAdmin, username) {
    // Save to local storage
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('isAdmin', isAdmin);
    window.localStorage.setItem('username', username);
    // Set headers
    Ember.$.ajaxSetup({headers: { 'x-access-token': token }});
  },

  updateToken: function (token, callback) {
    // Save to local storage
    window.localStorage.setItem('token', token);

    // Set headers
    Ember.$.ajaxSetup({headers: { 'x-access-token': token }});
    Ember.run(function () {
      callback();
    });
  }
});

loadInitializers(App, config.modulePrefix);

export default App;

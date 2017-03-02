// web/js/app/app.js

/* Setup Authorization */

/* global Ember */

window.ENV = window.ENV || {};
window.ENV['simple-auth'] = {
  authorizer: 'authorizer:custom',
  routeAfterAuthentication: 'frontpage',
  routeIfAlreadyAuthenticated: 'frontpage',
  applicationRootUrl: '/'
};

var App = Ember.Application.create({ // eslint-disable-line no-unused-vars
  // for development only, remove for production
  LOG_TRANSITIONS: false,
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

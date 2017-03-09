// app/authenticators/custom.js

import Ember from 'ember';
import Base from 'ember-simple-auth/authenticators/base';

export default Base.extend({
  tokenEndpoint: '/login', // *** TEST ***
  verifyEndpoint: '/check_token',
  restore (data) {
    const _this = this;
    if (!Ember.isEmpty(data.token)) {
      Ember.$.ajaxSetup({headers: { 'x-access-token': data.token }});
    }
    return new Ember.RSVP.Promise((resolve, reject) => {
      if (!Ember.isEmpty(data.token)) {
        Ember.$.ajax({
          url: _this.verifyEndpoint,
          type: 'GET',
          contentType: 'application/json',
          dataType: 'json',
          success: function (response) {
            Ember.run(() => {
              if (response.authenticated) {
                resolve(data);
              } else {
                reject();
              }
            });
          },
          error: function (error) {
            if (error.status === 403) {
              console.error('$$$ auth: access denied on restore -- ' + error.responseText);
              Ember.run(this, reject);
            } else {
              console.error('There was an error reaching the server. (Unrecognized certificate or bad connection most likely.)');
            }
          }
        });
      } else {
        Ember.run(this, reject);
      }
    });
  },

  authenticate (user, pass) {
    const _this = this;
    return new Ember.RSVP.Promise((resolve, reject) => {
      let postdata = JSON.stringify({username: user, password: pass});
      Ember.$.ajax({
        url: _this.tokenEndpoint,
        type: 'POST',
        data: postdata,
        contentType: 'application/json',
        dataType: 'json'
      }).then((response) => {
        Ember.run(() => {
          resolve({
            token: response.token,
            username: response.username,
            isAdmin: response.isAdmin
          });
        });
      }, function (xhr, status, error) {
        console.error('$$$ auth: rejecting...', error, ' ', status, ' ', JSON.stringify(xhr));
        Ember.run(this, reject, xhr.responseText);
      }
      );
    });
  },

  invalidate () {
    const _this = this;
    window.localStorage.setItem('token', undefined);
    window.localStorage.setItem('username', undefined);
    window.localStorage.setItem('isAdmin', undefined);

    return new Ember.RSVP.Promise((resolve) => {
      Ember.$.ajax({ url: _this.tokenEndpoint, type: 'DELETE' }).always(() => {
        Ember.run(_this, resolve);
      });
    });
  }
});

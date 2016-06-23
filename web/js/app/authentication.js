// web/js/app/authentication.js
/* global Ember, App, SimpleAuth, config */

App.NodesecAuthenticator = SimpleAuth.Authenticators.Base.extend({
  tokenEndpoint: '/login', // *** TEST ***
  verifyEndpoint: '/check_token',
  restore: function (data) {
    var _this = this;
    if (!Ember.isEmpty(data.token)) {
      Ember.$.ajaxSetup({headers: { 'x-access-token': data.token }});
    }
    return new Ember.RSVP.Promise(function (resolve, reject) {
      if (!Ember.isEmpty(data.token)) {
        Ember.$.ajax({
          url: _this.verifyEndpoint,
          type: 'GET',
          contentType: 'application/json',
          dataType: 'json',
          success: function (response) {
            Ember.run(function () {
              if (response.authenticated) {
                resolve(data);
              } else {
                reject();
              }
            });
          },
          error: function (error) {
            if (error.status === 403) {
              console.error('$$$ auth: access denied on restore -- ', error.responseText);
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

  authenticate: function (credentials) {
    var _this = this;

    return new Ember.RSVP.Promise(function (resolve, reject) {
      var postdata = JSON.stringify({username: credentials.identification, password: credentials.password});
      Ember.$.ajax({
        url: _this.tokenEndpoint,
        type: 'POST',
        data: postdata,
        contentType: 'application/json',
        dataType: 'json'
      }).then(function (response) {
        App.saveToken(response.token, response.isAdmin, response.username);

        Ember.run(function () {
          resolve({
            token: response.token,
            username: response.username,
            isAdmin: response.isAdmin
          });
        });
      }, function (xhr, status, error) {
        console.log('$$$ auth: rejecting...', error, ' ', status, ' ', JSON.stringify(xhr));
        Ember.run(this, reject, xhr.responseText);
      }
      );
    });
  },

  invalidate: function () {
    var _this = this;

    window.localStorage.setItem('token', undefined);
    window.localStorage.setItem('username', undefined);
    window.localStorage.setItem('isAdmin', undefined);

    return new Ember.RSVP.Promise(function (resolve) {
      Ember.$.ajax({ url: _this.tokenEndpoint, type: 'DELETE' }).always(function () {
        Ember.run(this, resolve);
      });
    });
  }
});

App.NodesecAuthorizer = SimpleAuth.Authorizers.Base.extend({
  authorize: function (jqXHR, requestOptions) {
    if (this.get('session.isAuthenticated') && !Ember.isEmpty(this.get('session.token'))) {
      jqXHR.setRequestHeader('Authorization', 'Token: ' + this.get('session.token'));
    }
  }
});

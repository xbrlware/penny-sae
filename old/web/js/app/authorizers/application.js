// web/js/app/authorizers/application.js
/* global Ember, App, SimpleAuth */

'use strict';

App.NodesecAuthorizer = SimpleAuth.Authorizers.Base.extend({
  authorize: function (jqXHR, requestOptions) {
    if (this.get('session.isAuthenticated') && !Ember.isEmpty(this.get('session.token'))) {
      jqXHR.setRequestHeader('Authorization', 'Token: ' + this.get('session.token'));
    }
  }
});


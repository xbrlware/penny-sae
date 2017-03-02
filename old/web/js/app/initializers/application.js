// web/js/app/initializers/application.js
/* global Ember, App */

'use strict';

Ember.Application.initializer({
  name: 'authentication',
  before: 'simple-auth',
  initialize: function (container, application) {
    container.register('authenticator:custom', App.NodesecAuthenticator);
    container.register('authorizer:custom', App.NodesecAuthorizer);
  }
});

// web/js/app/routes/g.js
/* global Ember, App, SimpleAuth */

'use strict';

App.GRoute = Ember.Route.extend(SimpleAuth.AuthenticatedRouteMixin);

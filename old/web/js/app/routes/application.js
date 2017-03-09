// web/js/app/routes/application.js
/* global Ember, App, SimpleAuth */

'use strict';

App.ApplicationRoute = Ember.Route.extend(SimpleAuth.ApplicationRouteMixin, {
  actions: {
    companySearch: function (searchTerm) {
      if (searchTerm) { this.transitionTo('sidebar', searchTerm); }
    },
    invalidateSession: function () {
      this.get('session').invalidate();
    }
  }
});


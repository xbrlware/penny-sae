// web/js/app/routes/leadership.js
/* global Ember, App, fetchLeadership */

'use strict';

App.LeadershipRoute = Ember.Route.extend({
  model: function () {
    var dm = this.modelFor('detail');
    return fetchLeadership({'cik': dm.cik});
  },
  setupController: function (con, model) {
    con.set('model', model);
  }
});

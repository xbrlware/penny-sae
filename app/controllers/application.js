// app/controllers/application.js

import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service(),
  searchCompanies: Ember.inject.service('search-companies'),

  actions: {
    companySearch: function (dada) {
      this.get('searchCompanies').getCompanies(dada, false);
    },

    invalidateSession: function () {
      this.get('session').invalidate();
    }
  }
});

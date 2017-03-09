// app/controllers/application.js

import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service(),
  searchCompanies: Ember.inject.service('search-companies'),

  actions: {
    companySearch: function (dada) {
      const _this = this;
      this.get('searchCompanies').getCompanies(dada, false).then(function (response) {
        if (response.hits.length > 0) {
          _this.transitionToRoute('sidebar.detail', response.hits[0].cik);
        } else {
          _this.transitionToRoute('sidebar.detail', '-');
        }
      });
    },

    invalidateSession: function () {
      this.get('session').invalidate();
    }
  }
});

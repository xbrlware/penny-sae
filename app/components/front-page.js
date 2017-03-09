// app/components/front-page.js

import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service(),
  searchCompanies: Ember.inject.service('search-companies'),
  isAdmin: function () {
    return window.localStorage.getItem('isAdmin') === 'true';
  }.property(),
  renderTemplate () {
    this.render();
  },
  actions: {
    companySearch (searchTerm) {
      if (searchTerm) {
        this.get('router').transitionTo('sidebar', searchTerm);
      }
    },

    filterSearch () {
      this.get('router').transitionTo('sidebar', '-');
    },

    toggleFlag (flag) {
      this.get('searchCompanies.redFlagParams._toggles').toggleProperty(flag);
    },

    invalidateSession () {
      this.get('session').invalidate();
    }
  }
});

// web/js/app/controllers/application.js
/* global Ember, App */

'use strict';

App.ApplicationController = Ember.Controller.extend({
  searchTerm: undefined,
  searchTopic: false,
  showNav: false,
  redFlagParams: App.RedFlagParams.create(),
  isLoading: false, // state variable for spinner

  search_company: function (cb) {
    App.Search.search_company(
      this.searchTerm,
      this.redFlagParams,
      this.searchTopic,
      false
    ).then(cb);
  },

  sort_companies: function (cb) {
    App.Search.search_company(
      undefined,
      this.redFlagParams,
      this.searchTopic,
      false
    ).then(cb);
  },

  refresh_companies: function (query, cb) {
    App.Search.search_company(
      query,
      this.redFlagParams,
      this.searchTopic,
      true
    ).then(cb);
  }
});


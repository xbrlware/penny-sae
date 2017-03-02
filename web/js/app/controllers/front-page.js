// web/js/app/controllers/front-page.js

/* global Ember, App */

'use strict';

App.FrontpageController = Ember.Controller.extend({
  application: Ember.inject.controller(),
  redFlagParams: Ember.computed.alias('application.redFlagParams'),
  isAdmin: function () { return App.isAdmin(); }.property(),
  renderTemplate: function () {
    this.render();
  },
  actions: {
    companySearch: function (searchTerm) {
      if (searchTerm) {
        this.transitionToRoute('sidebar', searchTerm);
      }
    },
    filterSearch: function () {
      this.transitionToRoute('sidebar', '-');
    },
    toggleFlag: function (flag) {
      this.get('redFlagParams._toggles').toggleProperty(flag);
    }
  }
});


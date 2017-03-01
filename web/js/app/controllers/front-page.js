// web/js/app/controllers/front-page.js

/* global Ember, App */

'use strict';

App.FrontpageController = Ember.Controller.extend({
  needs: ['application'],
  redFlagParams: Ember.computed.alias('controllers.application.redFlagParams'),
  isAdmin: function () { return App.isAdmin(); }.property(),
  renderTemplate: function () {
    this.render();
  },
  actions: {
    companySearch: function (searchTerm) {
      console.log('frontpage companySearch ::', searchTerm);
      if (searchTerm) { this.transitionToRoute('sidebar', searchTerm); }
    },
    filterSearch: function () {
      this.transitionToRoute('sidebar', '-');
    },
    toggleFlag: function (flag) {
      this.get('redFlagParams._toggles').toggleProperty(flag);
    }
  }
});


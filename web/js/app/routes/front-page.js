// web/js/app/routes/front-page.js
/* global App */

'use strict';

App.FrontpageRoute = App.GRoute.extend({
  setupController: function (controller, model) {
    this.controllerFor('application').set('showNav', false);
  },

  renderTemplate: function () {
    this.render();
  },

  actions: {
    companySearch: function (searchTerm) {
      if (searchTerm) { this.transitionTo('sidebar', searchTerm); }
    },
    filterSearch: function () {
      this.transitionTo('sidebar', '-');
    },
    toggleFlag: function (flag) {
      this.get('controlle.redFlagParams._toggles').toggleProperty(flag);
    }
  }
});

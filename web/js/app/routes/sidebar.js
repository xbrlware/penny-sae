// web/js/app/routes/sidebar.js
/* global App, _ */

'use strict';

App.SidebarRoute = App.GRoute.extend({
  model: function (params) {
    return params;
  },

  renderTemplate: function () {
    this.render();
  },

  setupController: function (controller, model) {
    var appCon = this.controllerFor('application');

    controller.set('isLoading', true);
    appCon.set('showNav', true);
    if (model.st === '-') {
      appCon.set('searchTerm', undefined);
      appCon.sort_companies(function (response) {
        controller.set('model', response);
        controller.set('isLoading', false);
      });
    } else if (model.st === '--' && controller.get('model') !== null) {
      appCon.set('searchTerm', undefined);
      var ciks = _.pluck(controller.get('model').hits, 'cik');
      appCon.refresh_companies(ciks, function (response) {
        controller.set('model', response);
        controller.set('isLoading', false);
      });
    } else {
      appCon.set('searchTerm', model.st);
      appCon.search_company(function (response) {
        controller.set('model', response);
        controller.set('isLoading', false);
      });
    }
  },
  actions: {
    toggleFlag: function (flag) {
      var toggles = this.get('controller.redFlagParams').get_toggles();
      toggles.get(flag) ? toggles.set(flag, false) : toggles.set(flag, true);
    },
    sort_companies: function () {
      var controller = this.get('controller');
      var appCon = this.controllerFor('application');
      controller.set('isLoading', true);
      appCon(function (response) {
        controller.transitionToRoute();
        controller.transitionToRoute('sidebar');
        controller.set('model', response);
        controller.con.set('isLoading', false);
      });
    },
    summary_detail: function () {
      return [1, 2, 3];
    }
  }
});

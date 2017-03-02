// web/js/app/sidebar.js
/* global Ember, App, alert, gconfig */

'use strict';

App.SidebarController = Ember.Controller.extend({
  application: Ember.inject.controller(),
  redFlagParams: Ember.computed.alias('application.redFlagParams'),
  searchTerm: Ember.computed.alias('application.searchTerm'),
  searchTopic: Ember.computed.alias('application.searchTopic'),
  isLoading: Ember.computed.alias('application.isLoading'),
  renderTemplate: function () {
    this.render();
  },
  actions: {
    toggleFlag: function (flag) {
      var toggles = this.get('redFlagParams').get_toggles();
      toggles.get(flag) ? toggles.set(flag, false) : toggles.set(flag, true);
    },

    sort_companies: function () {
      var _this = this;
      var appCon = this.get('application');
      this.set('isLoading', true);
      appCon(function (response) {
        _this.transitionToRoute();
        _this.transitionToRoute('sidebar');
        _this.set('model', response);
        _this.set('isLoading', false);
      });
    },

    summary_detail: function () {
      return [1, 2, 3];
    },

    iterateSidebar: function (dir) {
      if (dir > 0) {
        this.set('from', this.get('from') + gconfig.SIZE);
      } else {
        this.set('from', Math.max(this.get('from') - gconfig.SIZE, 0));
      }

      this.set('isLoading', true);
      // This is what used to be implemented here:
      //      App.Search.search_filter(redFlagParams, this.get('from'), this.get('model')).then(function (response) {
      //
      alert('look at the code -- this isnt actually implemented');
      var this_ = this;
      App.Search.search_company(undefined, this.get('redFlagParams')).then(function (response) {
        this_.set('model', response);
        this_.set('isLoading', false);
      });
    }
  }
});

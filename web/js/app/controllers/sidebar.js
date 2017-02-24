// web/js/app/sidebar.js
/* global Ember, App, alert, gconfig */

'use strict';

App.SidebarController = Ember.ObjectController.extend({
  needs: ['application'],
  redFlagParams: Ember.computed.alias('controllers.application.redFlagParams'),
  searchTerm: Ember.computed.alias('controllers.application.searchTerm'),
  searchTopic: Ember.computed.alias('controllers.application.searchTopic'),
  isLoading: Ember.computed.alias('controllers.application.isLoading'),

  actions: {
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

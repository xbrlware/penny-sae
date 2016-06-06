// web/js/app/frontpage.js

/* global Ember, App */

App.FrontpageRoute = App.GRoute.extend({
  setupController: function (controller, model) {
    this.controllerFor('application').set('showNav', false);
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

App.FrontpageController = Ember.ObjectController.extend({
  needs: ['application'],
  redFlagParams: Ember.computed.alias('controllers.application.redFlagParams'),
  isAdmin: function () { return App.isAdmin(); }.property()
});

// --

App.ToggleRowView = Ember.View.extend({
  classNames: ['toggle-row-bg'],
  templateName: 'togglerow',
  tagName: 'tr',
  click: function (e) {
    if (Ember.$(e.target).attr('class') !== 'dropdown-button') {
      this.toggleProperty('value');
    }
  }
});

App.DisabledToggleRowView = Ember.View.extend({
  templateName: 'disabledtogglerow',
  tagName: 'tr',
  classNames: ['no-hover']
});

App.HitTextView = Ember.View.extend({
  templateName: 'hittextview',
  didInsertElement: function () {
    var type = this.get('type');
    var redFlags = this.get('redFlags');
    
    this.set('mid', 'badge-' + type);
    this.set('have', redFlags[type]['have']);
    this.set('flagged', redFlags[type]['is_flag']);
    this.set('value', redFlags[type]['value']);
  }
});

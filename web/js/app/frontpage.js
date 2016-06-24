// web/js/app/frontpage.js

/* global Ember, App */

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
    var redFlag = this.get('redFlags');

    this.set('mid', 'badge-' + this.get('type'));
    this.set('have', redFlag['have']);
    this.set('flagged', redFlag['is_flag']);
    this.set('value', redFlag['value']);
    this.set('label', redFlag['label']);
  }
});

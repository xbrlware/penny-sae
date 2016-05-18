// web/js/app/frontpage.js

// Front Page
App.FrontpageRoute = App.GRoute.extend({
  setupController: function (controller, model) {
    this.controllerFor('application').set('showNav', false)
  },
  actions: {
    companySearch: function (searchTerm) {
      if (searchTerm) { this.transitionTo('sidebar', searchTerm); }
    },
    filterSearch: function () {
      this.transitionTo('sidebar', '-')
    },
    toggleFlag: function (flag) {
      this.get('controlle.redflag_params._toggles').toggleProperty(flag)
    }
  }
})

App.FrontpageController = Ember.ObjectController.extend({
  needs: ['application'],
  redflag_params: Ember.computed.alias('controllers.application.redflag_params'),
  isAdmin: function () {return App.isAdmin();}.property(),
})

// --

App.ToggleRowView = Ember.View.extend({
  classNames: ['toggle-row-bg'],
  templateName: 'togglerow',
  tagName: 'tr',
  click: function (e) {
    if ($(e.target).attr('class') !== 'dropdown-button') {
      var value = this.get('value')
      this.toggleProperty('value')
    }
  }
})

App.DisabledToggleRowView = Ember.View.extend({
  templateName: 'disabledtogglerow',
  tagName: 'tr',
  classNames: ['no-hover']
})

App.HitTextView = Ember.View.extend({
  templateName: 'hittextview',
  didInsertElement: function () {
    var type = this.get('type'),
      red_flags = this.get('red_flags')

    this.set('mid', 'badge-' + type)
    console.log('type', type)
    console.log('red_flags', red_flags)
    this.set('have', red_flags[type]['have'])
    this.set('flagged', red_flags[type]['is_flag'])
    this.set('value', red_flags[type]['value'])
  }
})

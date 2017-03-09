// web/js/app/sidebar.js
/* global Ember, App */

'use strict';

App.SidebarView = Ember.View.extend({
  willInsertElement: function () {
    Ember.$('body').css({
      'transition': 'background-color 0.5s ease-in-out',
      'background-color': 'white'
    });

    Ember.$('body').on('click.collapse-next.data-api', '[data-toggle=collapse-next]', function () {
      var $next = Ember.$(this).parent().next();
      var $others = Ember.$('.ab-sidebar');
      $others.collapse({toggle: false});
      $others.collapse('hide');
      $next.collapse('toggle');
    });
  },
  didInsertElement: function () {
    Ember.$('#big-dropdown-button').trigger('click.bs.dropdown');
  }
});

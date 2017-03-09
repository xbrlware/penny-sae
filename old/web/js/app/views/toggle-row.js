// web/js/app/views/toggle-row.js
/* global Ember, App */

'use strict';

App.ToggleRowView = Ember.View.extend({
  classNames: ['toggle-row-bg'],
  click: function (e) {
    if (Ember.$(e.target).attr('class') !== 'dropdown-button') {
      this.toggleProperty('value');
    }
  }
});

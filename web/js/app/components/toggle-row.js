// web/js/app/component/toggle-row.js
/* global Ember, App */

'use strict';

App.ToggleRowComponent = Ember.Component.extend({
  classNames: ['toggle-row-bg'],
  click: function (e) {
    if (Ember.$(e.target).attr('class') !== 'dropdown-button') {
      this.toggleProperty('value');
    }
  }
});

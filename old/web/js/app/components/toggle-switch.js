// web/js/app/components/toggle-switch.js
/* global Ember, App */

'use strict';

App.ToggleSwitchComponent = Ember.Component.extend({
  classNames: ['toggle-switch'],
  init: function () {
    this._super.apply(this, arguments);
    return this.on('change', this, this._updateElementValue);
  },

  checkBoxId: function () {
    return 'checker-' + this.get('elementId');
  }.property(),

  _updateElementValue: function () {
    return this.set('checked', this.$('input').prop('checked'));
  }
});

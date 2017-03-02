// web/js/app/components/big-input.js
/* global Ember, App */

'use strict';

App.BigInputComponent = Ember.TextField.extend({
  attributeBindings: ['style', 'type', 'value', 'size'],
  becomeFocused: function () {
    this.$().focus();
  }.on('didInsertElement')
});


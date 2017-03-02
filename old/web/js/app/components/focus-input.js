// web/js/app/components/focus-input.js
/* global Ember, App */

'use strict';

App.FocusInputComponent = Ember.TextField.extend({
  attributeBindings: ['style', 'type', 'value', 'size']
//  becomeFocused: function () {
//    this.$().focus()
//  }.on('didInsertElement')
});

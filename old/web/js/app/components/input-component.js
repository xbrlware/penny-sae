// web/js/app/components/input-component.js
/* global Ember, App */

'use strict';

App.InputComponent = Ember.TextField.extend({
  attributeBindings: ['style', 'type', 'value', 'size']
});


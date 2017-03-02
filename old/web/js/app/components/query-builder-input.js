// web/js/app/components/query-builder-input.js
/* global Ember, App */

'use strict';

App.QueryBuilderInputComponent = Ember.TextField.extend({
  attributeBindings: ['style', 'type', 'value', 'size']
});

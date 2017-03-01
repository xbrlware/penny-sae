// web/js/app/helpers/concat-helper.js
/* global Ember */

'use strict';

Ember.Handlebars.helper('concat-helper', function (string1, string2) {
  return string1 + string2;
});

// web/js/app/objects/search-results.js
/* global Ember, App */

'use strict';

App.SearchResults = Ember.Object.extend({
  total_hits: undefined,
  hits: undefined,
  from: 0
});

// app/utils/search-results.js

import Ember from 'ember';

export default Ember.Object.extend({
  total_hits: undefined,
  hits: undefined,
  from: 0
});

// app/helpers/concat-helper.js

import Ember from 'ember';

export function concatHelper (string1, string2) {
  return string1 + string2.toString();
}

export default Ember.Helper.helper(concatHelper);

import Ember from 'ember';
import SearchMixinMixin from 'penny-sae/mixins/search-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | search mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let SearchMixinObject = Ember.Object.extend(SearchMixinMixin);
  let subject = SearchMixinObject.create();
  assert.ok(subject);
});

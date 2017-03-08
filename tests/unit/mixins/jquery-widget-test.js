import Ember from 'ember';
import JqueryWidgetMixin from 'penny-sae/mixins/jquery-widget';
import { module, test } from 'qunit';

module('Unit | Mixin | jquery widget');

// Replace this with your real tests.
test('it works', function(assert) {
  let JqueryWidgetObject = Ember.Object.extend(JqueryWidgetMixin);
  let subject = JqueryWidgetObject.create();
  assert.ok(subject);
});

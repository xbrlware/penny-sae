import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('toggle-switch', 'Integration | Component | toggle switch', {
  integration: true
});

test('it renders', function (assert) {
  assert.expect(1);
  this.set('topicChecked', true);

  this.render(hbs`{{toggle-switch checked=topicChecked}}`);
  assert.equal(this.$('input').prop('checked'), true);
});

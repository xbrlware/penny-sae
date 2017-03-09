import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('toggle-row', 'Integration | Component | toggle row', {
  integration: true
});

test('it renders', function (assert) {
  assert.expect(2);

  this.set('description', 'Check this if you believe it is true');
  this.set('switchValue', true);
  this.render(hbs`{{toggle-row text=description value=switchValue}}`);
  assert.equal(this.$('i').prop('class'), 'fa fa-check-square-o fa-1x red-text');

  this.set('switchValue', false);
  this.render(hbs`{{toggle-row text=description value=switchValue}}`);
  assert.equal(this.$('i').prop('class'), 'fa fa-square-o fa-1x greyed');
});

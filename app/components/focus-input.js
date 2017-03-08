import Ember from 'ember';

export default Ember.TextField.extend({
  attributeBindings: ['style', 'type', 'value', 'size']
});

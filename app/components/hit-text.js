// app/components/hit-text.js

import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement: function () {
    let redFlag = this.get('redFlags');

    this.set('mid', 'badge-' + this.get('type'));
    this.set('have', redFlag['have']);
    this.set('flagged', redFlag['is_flag']);
    this.set('value', redFlag['value']);
    this.set('label', redFlag['label']);
  },

  flagged: Ember.computed('flagged', 'first_column', function () {
    let flagged = this.get('flagged') ? 'flagged' : 'not-flagged';
    let firstColumn = this.get('first_column') ? 'first_column' : 'second_column';
    return flagged + ' ' + firstColumn;
  })
});

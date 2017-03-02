// web/js/app/views/hit-text.js
/* global Ember, App */

'use strict';

App.HitTextView = Ember.View.extend({
  templateName: 'hittextview',
  didInsertElement: function () {
    var redFlag = this.get('redFlags');

    this.set('mid', 'badge-' + this.get('type'));
    this.set('have', redFlag['have']);
    this.set('flagged', redFlag['is_flag']);
    this.set('value', redFlag['value']);
    this.set('label', redFlag['label']);
  }
});

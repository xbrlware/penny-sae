// app/components/toggle-row.js

import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  classNames: ['toggle-row-bg'],
  click: function (e) {
    if (Ember.$(e.target).attr('class') !== 'dropdown-button') {
      this.toggleProperty('value');
    }
  },
  actions: {
    showParameters (params) {
      this.sendAction('showParams', params);
    }
  }
});

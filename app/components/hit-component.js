// app/components/hit-component.js

import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    getDetails (cik) {
      console.log(cik);
      this.get('router').transitionTo('sidebar.detail', cik);
    }
  }
});

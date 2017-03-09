// app/objects/red-flag-params.js

import Ember from 'ember';
import _ from 'underscore';
import Gconfig from '../user-config/global-config';

export default Ember.Object.extend({
  _params: Gconfig.DEFAULT_REDFLAG_PARAMS,
  _toggles: Gconfig.DEFAULT_TOGGLES,

  get_params: function () {
    return this.get('_params');
  },

  get_toggles: function () {
    return this.get('_toggles');
  },

  get_toggled_params: function () {
    var params = this.get('_params');
    var toggles = this.get('_toggles');
    return _.chain(params).pairs().filter(
        function (x) {
          return toggles[x[0]];
        }).object().value();
  }
});

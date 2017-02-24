// web/js/app/objects/red-flag-params.js
/* global Ember, App, _, gconfig */

'use strict';

App.RedFlagParams = Ember.Object.extend({
  _params: gconfig.DEFAULT_REDFLAG_PARAMS,
  _toggles: gconfig.DEFAULT_TOGGLES,
  get_params: function () { return this.get('_params'); },
  get_toggles: function () { return this.get('_toggles'); },
  get_toggled_params: function () {
    var params = this.get('_params');
    var toggles = this.get('_toggles');
    return _.chain(params).pairs().filter(function (x) { return toggles[x[0]]; }).object().value();
  }
});

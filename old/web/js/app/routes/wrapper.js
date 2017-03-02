// web/js/app/routes/wrapper.js
/* global App, config */

'use strict';

App.WrapperRoute = App.GRoute.extend({
  beforeModel: function (params) {
    if (params.targetName === 'wrapper.index') {
      this.transitionTo('application', config.DEFAULT_PATH);
    }
  }
});

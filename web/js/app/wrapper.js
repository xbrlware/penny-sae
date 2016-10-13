// web/js/app/wrapper.js

/* global Ember, App, config */

// Wrapper was initially necessary to make routing work with
// authentication.  Could potentially be removed in the future.
App.WrapperView = Ember.View.extend();

App.WrapperRoute = App.GRoute.extend({
  beforeModel: function (params) {
    if (params.targetName === 'wrapper.index') {
      this.transitionTo('application', config.DEFAULT_PATH);
    }
  }
});

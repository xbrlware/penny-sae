// web/js/app/views/detail.js
/* global Ember, App */

'use strict';

App.DetailView = Ember.View.extend({
  controllerChanged: function () { Ember.$('html, body').animate({ scrollTop: 0 }, '500', 'swing'); }.observes('controller.model'),
  didInsertElement: function () { this.$().hide().fadeIn('slow'); }
});


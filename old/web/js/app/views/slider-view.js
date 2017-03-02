// web/js/app/views/slider-view.js
/* global Ember, App, JQ */

'use strict';

JQ.SliderView = Ember.View.extend(JQ.Widget, {
  uiType: 'slider',
  uiOptions: ['value', 'min', 'max', 'step'],
  uiEvents: ['slide']
});

App.SliderView = JQ.SliderView.extend({
  attributeBindings: ['style', 'type', 'value', 'size'],
  slide: function (e, ui) {
    this.set('value', ui.value);
  }
});

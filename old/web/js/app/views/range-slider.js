// web/js/app/views/range-slider.js
/* global Ember, App, JQ */

'use strict';

JQ.RangeSliderView = Ember.View.extend(JQ.Widget, {
  uiType: 'slider',
  uiOptions: ['values', 'min', 'max', 'range'],
  uiEvents: ['slide']
});

App.RangeSliderView = JQ.RangeSliderView.extend({
  attributeBindings: ['style', 'type', 'values', 'size'],
  range: true,
  slide: function (e, ui) {
    this.set('values', ui.values);
  }
});

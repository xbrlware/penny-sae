// app/components/range-slider.js

import Ember from 'ember';
import JqueryWidget from '../mixins/jquery-widget';

export default Ember.Component.extend(JqueryWidget, {
  uiType: 'slider',
  uiOptions: ['values', 'min', 'max', 'range'],
  uiEvents: ['slide'],
  attributeBindings: ['style', 'type', 'values', 'size'],
  range: true,
  slide: function (e, ui) {
    this.set('values', ui.values);
  }
});

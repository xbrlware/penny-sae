// app/components/slider-component.js

import Ember from 'ember';
import JqueryWidget from '../mixins/jquery-widget';

export default Ember.Component.extend(JqueryWidget, {
  uiType: 'slider',
  uiOptions: ['value', 'min', 'max', 'step'],
  uiEvents: ['slide'],
  attributeBindings: ['style', 'type', 'value', 'size'],
  slide: function (e, ui) {
    this.set('value', ui.value);
  }
});

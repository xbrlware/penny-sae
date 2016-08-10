// web/js/app/components.js
/* global Ember, App */

// Components

App.InputComponent = Ember.TextField.extend({
  attributeBindings: ['style', 'type', 'value', 'size']
});

App.FocusInputComponent = Ember.TextField.extend({
  attributeBindings: ['style', 'type', 'value', 'size']
//  becomeFocused: function () {
//    this.$().focus();
//  }.on('didInsertElement')
});

App.QueryBuilderInputComponent = Ember.TextField.extend({
  attributeBindings: ['style', 'type', 'value', 'size']
});

App.BigInputComponent = Ember.TextField.extend({
  attributeBindings: ['style', 'type', 'value', 'size'],
  becomeFocused: function () {
    this.$().focus();
  }.on('didInsertElement')
});

Ember.LinkView.reopen({
  attributeBindings: ['data-toggle']
});

App.ToggleSwitch = Ember.View.extend({
  classNames: ['toggle-switch'],
  templateName: 'toggle-switch',

  init: function () {
    this._super.apply(this, arguments);
    return this.on('change', this, this._updateElementValue);
  },

  checkBoxId: function () {
    return 'checker-' + this.get('elementId');
  }.property(),

  _updateElementValue: function () {
    return this.set('checked', this.$('input').prop('checked'));
  }
});

App.FilterButtonComponent = Ember.Component.extend({
  tagName: 'button',
  classNames: ['btn', 'btn-default', 'fa'],
  classNameBindings: ['colXs2:col-xs-2', 'colXs6:col-xs-6', 'btnXs:btn-xs', 'btnRoundXs:btn-round-xs', 'filterDoc:filter-doc', 'filterMax:filter-max', 'filterPos:filter-pos', 'filterNeut:filter-neut', 'active', 'faChevronUp:fa-chevron-up', 'faChevronDown:fa-chevron-down', 'sentiment', 'numposts', 'filterNeg:filter-neg', 'filterMean:filter-mean'],
  title: undefined,
  colXs2: false,
  colXs6: false,
  btnXs: false,
  btnRoundXs: false,
  filterDoc: false,
  filterMax: false,
  filterPos: false,
  filterNeut: false,
  active: false,
  faChevronUp: false,
  faChevronDown: false,
  sentiment: false,
  numposts: false,
  filterNeg: false,
  filterMean: false,
  click: function () {
    this.sendAction('action', this.get('param'));
  }
});

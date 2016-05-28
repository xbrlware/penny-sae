// web/js/app/components.js
/* global Ember, App */

// Components

App.InputComponent = Ember.TextField.extend({
  attributeBindings: ['style', 'type', 'value', 'size']
});

App.FocusInputComponent = Ember.TextField.extend({
  attributeBindings: ['style', 'type', 'value', 'size'],
  becomeFocused: function () {
    this.$().focus();
  }.on('didInsertElement')
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

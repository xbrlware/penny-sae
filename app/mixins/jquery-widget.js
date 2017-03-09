// app/mixins/jquery-widget.js

/* global jQuery */

import Ember from 'ember';

export default Ember.Mixin.create({
  didInsertElement: function () {
    var options = this._gatherOptions();
    this._gatherEvents(options);
    var ui;

    if (typeof jQuery.ui[this.get('uiType')] === 'function') {
      ui = jQuery.ui[this.get('uiType')](options, this.get('element'));
    } else {
      ui = this.$()[this.get('uiType')](options);
    }
    this.set('ui', ui);
  },

  willDestroyElement: function () {
    var ui = this.get('ui');
    if (ui) {
      var observers = this._observers;
      for (var prop in observers) {
        if (observers.hasOwnProperty(prop)) {
          this.removeObserver(prop, observers[prop]);
        }
      }

      if (ui._destroy) {
        ui._destroy();
      } else if (ui.datepicker) {
        ui.datepicker('destroy');
      }
    }
  },

  _gatherOptions: function () {
    var uiOptions = this.get('uiOptions');
    var options = {};

    uiOptions.forEach(function (key) {
      options[key] = this.get(key);
      var observer = function () {
        var value = this.get(key);
        if (Ember.$.isFunction(this.get('ui').option)) {
          this.get('ui').option(key, value);
        }
      };

      this.addObserver(key, observer);
      this._observers = this._observers || {};
      this._observers[key] = observer;
    }, this);
    return options;
  },

  _gatherEvents: function (options) {
    var uiEvents = this.get('uiEvents') || [];
    var self = this;

    uiEvents.forEach(function (event) {
      var callback = self[event];

      if (callback) {
        options[event] = function (event, ui) { callback.call(self, event, ui); };
      }
    });
  }

});

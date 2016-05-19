// web/js/app/slider.js
/* global jQuery, Ember, App */

var JQ = Ember.Namespace.create();
JQ.Widget = Ember.Mixin.create({
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
      ui._destroy();
    }
  },

  _gatherOptions: function () {
    var uiOptions = this.get('uiOptions');
    var options = {};

    uiOptions.forEach(function (key) {
      options[key] = this.get(key);
      var observer = function () {
        var value = this.get(key);
        try {
          this.get('ui').option(key, value);
        } catch (e) {
          // this is here just to catch non-functions... is safe.
          console.warn('safe to ignore :: ', e);
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

JQ.SliderView = Ember.View.extend(JQ.Widget, {
  uiType: 'slider',
  uiOptions: ['value', 'min', 'max', 'step'],
  uiEvents: ['slide']
});

JQ.DatepickerView = Ember.View.extend(JQ.Widget, {
  tagName: 'input',
  type: 'text',
  uiType: 'datepicker',
  uiOptions: ['altField', 'altFormat', 'appendText', 'autoSize', 'beforeShow', 'beforeShowDay',
    'buttonImage', 'buttonImageOnly', 'buttonText', 'calculateWeek', 'changeMonth', 'changeYear',
    'closeText', 'constrainInput', 'currentText', 'dateFormat', 'dayNames', 'dayNamesMin',
    'dayNamesShort', 'defaultDate', 'duration', 'firstDay', 'gotoCurrent', 'hideIfNoPrevNext',
    'isRTL', 'maxDate', 'minDate', 'monthNames', 'monthNamesShort', 'navigationAsDateFormat',
    'nextText', 'numberOfMonths', 'onChangeMonthYear', 'onClose', 'onSelect', 'prevText', 'selectOtherMonths',
    'shortYearCutoff', 'showAnim', 'showButtonPanel', 'showCurrentAtPos', 'showMonthAfterYear',
    'showOn', 'showOptions', 'showOtherMonths', 'showWeek', 'stepMonths', 'weekHeader',
    'yearRange', 'yearSuffix'],
  uiEvents: ['create', 'beforeShow', 'beforeShowDay', 'onChangeMonthYear', 'onClose', 'onSelect', 'setDate']
});

App.SliderView = JQ.SliderView.extend({
  attributeBindings: ['style', 'type', 'value', 'size'],
  slide: function (e, ui) {
    this.set('value', ui.value);
  }
});

App.DatepickerView = JQ.DatepickerView.extend({
  attribueBindings: ['id', 'value'],
  dateFormat: 'yy-mm-dd',
  changeMonth: true,
  changeYear: true,
  showOn: 'focus',
  onSelect: function (event, ui) {
    var newDate = ui.currentYear + '-' + (ui.currentMonth + 1) + '-' + ui.currentDay;
    this.set('value', newDate);
  }
});

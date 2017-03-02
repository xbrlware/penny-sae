// web/js/app/views/date-picker.js
/* global JQ, Ember, App */

'use strict';

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
  uiEvents: ['create', 'beforeShow', 'beforeShowDay', 'onChangeMonthYear', 'onClose', 'onSelect', 'setDate'],
  yearRange: '-20:+1'
});

App.DatepickerView = JQ.DatepickerView.extend({
  attributeBindings: ['id', 'value'],
  dateFormat: 'yy-mm-dd',
  changeMonth: true,
  changeYear: true,
  showOn: 'focus',
  onSelect: function (event, ui) {
    this.set('value', event);
  }
});

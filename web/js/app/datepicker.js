App.DatePickerView = Ember.View.extend({
  didInsertElement: function () {
    Ember.$('#datepicker').datepicker();
  }
});

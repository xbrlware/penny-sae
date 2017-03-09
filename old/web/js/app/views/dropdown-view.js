// web/js/app/dropdown.js

/* global Ember, App */

'use strict';

App.DropdownView = Ember.View.extend({
  templateName: 'dropdown',
  didInsertElement: function () {
    Ember.$('#big-dropdown-button').trigger('click.bs.dropdown');

    Ember.$('.dropdown-menu tr').click(function (e) {
      e.preventDefault();
    });

    Ember.$('#big-dropdown-button').on('click', function (event) {
      Ember.$(this).parent().toggleClass('open');
    });

    Ember.$('fa').click(function (e) {
      return false;
    });

    Ember.$('#compute-button').click(function (e) {
      return false;
    });

    Ember.$('#input-topic').click(function (e) {
      return false;
    });
  }
});

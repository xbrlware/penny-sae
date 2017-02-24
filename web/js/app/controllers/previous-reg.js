// web/js/app/controllers/previous-reg.js
/* global Ember, App */

'use strict';

App.PreviousRegController = Ember.Controller.extend({
  needs: ['detail'],
  name: Ember.computed.alias('controllers.detail.model'),
  have_records: true,

  tableDiv: '#previous-reg-table',
  tableColumns: [
    {title: 'Company'},
    {title: 'Date', className: 'dt-body-right'},
    {title: 'Release Number'},
    {title: 'Link'}
  ],

  tableContent: function () {
    var m = this.get('model');
    if (m) {
      return m.map(function (x) {
        return [x.company, x.date, x.release_number, x.link];
      });
    }
  }.property('model')
});

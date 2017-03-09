// web/js/app/views/search-results.js
/* global Ember, App, _ */

'use strict';

App.SearchResultsView = Ember.View.extend({
  columns: [
    {title: 'Min Date', defaultContent: '', className: 'dt-body-right'},
    {title: 'Name', defaultContent: ''},
    {title: 'Ticker', defaultContent: ''},
    {title: 'SIC', defaultContent: ''}
  ],

  didInsertElement: function () {
    this._super();
    Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
  },

  afterRenderEvent: function () {
    var _this = this;
    var cik = this.get('cik');
    var columns = this.get('columns');

    App.Search.fetch_data('company_table', {'cik': cik}).then(function (response) {
      Ember.$('#search_result_' + cik).DataTable({
        fnDrawCallback: function (oSettings) {
          if (oSettings._iDisplayLength > oSettings._iRecordsDisplay) {
            Ember.$(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
          }
        },
        columns: columns,
        data: _.map(response['table'], function (x) {
          return [_this.dateConversion(x.min_date), x.name, x.ticker, x.sic];
        }),
        bFilter: false,
        bInfo: false
      });
    });
  },

  dateConversion: function (d) {
    var date = new Date(d);
    return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
  }
});

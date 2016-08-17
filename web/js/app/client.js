// web/js/app/client.js
/* global Ember, App, _ */

function fetch (args) { // eslint-disable-line no-unused-vars
  Ember.$.ajax({
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    url: args.endpoint,
    data: JSON.stringify({
      'index': args.index,
      'query_type': args.query_type,
      'query_args': args.query_args,
      'from': args.from,
      'rf': args.rf
    }),
    success: args.callback,
    error: function (xhr, status, error) {
      console.log('Error: ' + error.message);
    }
  });
}

App.SearchResults = Ember.Object.extend({
  total_hits: undefined,
  hits: undefined,
  from: 0
});

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

App.Search = Ember.Object.extend({});

App.Search.reopenClass({
  search_company: function (query, redFlagParams, searchTopic = false , refresh = false) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      Ember.$.ajax({
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        url: 'search',
        data: JSON.stringify({
          'query': query,
          'redFlagParams': redFlagParams.get_toggled_params(),
          'searchTopic': searchTopic,
          'mode' : refresh ? 'refresh' : 'search'
        }),
        success: function (response) {
          resolve(App.SearchResults.create(response));
        },
        error: function (xhr, status, error) {
          console.log('Error: ' + error.message);
        }
      });
    });
  },

  fetch_data: function (detailName, name) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      Ember.$.ajax({
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        url: detailName,
        data: JSON.stringify(name),
        success: resolve,
        error: function (error) {
          console.error('fetch_data :: ', error.message);
        }
      });
    });
  }
});

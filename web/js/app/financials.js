// web/js/app/financials.js

/* global Ember, App, _ */

App.FinancialsRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    App.Search.fetch_data('financials', this.get('controller.name')).then(function (response) {
      controller.set('model', response.data);
    });
  }
});

var niceNumber = function (x) {
  return x === undefined ? 'NA' : x.toLocaleString();
};

App.FinancialsController = Ember.Controller.extend({
  needs: ['detail'],
  name: Ember.computed.alias('controllers.detail.model'),
  tableDiv: '#financials-table',
  tableColumns: [
    {title: 'Company', className: 'dt-body-right', defaultContent: 'NA'},
    {title: 'Date', defaultContent: 'NA'},
    {title: 'Filing', className: 'dt-body-right', defaultContent: 'NA'},
    {title: 'Assets', className: 'dt-body-right', render: niceNumber},
    {title: 'Liabilities & Stockholders Equity', render: niceNumber},
    {title: 'Net Income', render: niceNumber},
    {title: 'Profit', className: 'dt-body-right', render: niceNumber},
    {title: 'Revenues', className: 'dt-body-right', render: niceNumber},
    {title: 'Earnings', render: niceNumber}
  ],

  smartGet: function (obj, key) {
    if (!obj[key]) {
      return undefined;
    }
    if (!obj[key].value) {
      return undefined;
    }
    return obj[key].value;
  },

  tableContent: function () {
    var this_ = this;
    return _.map(this.get('model'), function (n) {
      return [n.name, n.date, n.form,
        this_.smartGet(n.__meta__.financials, 'assets'),
        this_.smartGet(n.__meta__.financials, 'liabilitiesAndStockholdersEquity'),
        this_.smartGet(n.__meta__.financials, 'netIncome'),
        this_.smartGet(n.__meta__.financials, 'profit'),
        this_.smartGet(n.__meta__.financials, 'revenues'),
        this_.smartGet(n.__meta__.financials, 'earnings')
      ];
    });
  }.property('model')
});

App.FinancialsView = App.GenericTableView.extend();

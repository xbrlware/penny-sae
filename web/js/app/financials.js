// web/js/app/financials.js

/* global Ember, App, _ */

App.FinancialsRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    App.Search.fetch_data('financials', this.get('controller.name')).then(function (response) {
      controller.set('model', response);
      console.log(response);
    });
  }
});

App.FinancialsController = Ember.Controller.extend({
  needs: ['detail'],
  name: Ember.computed.alias('controllers.detail.model'),
  tableDiv: '#financials-table',
  tableColumns: [
    {title: 'Company', className: 'dt-body-right', defaultContent: 'NA'},
    {title: 'Date', defaultContent: 'NA'},
    {title: 'Filing', className: 'dt-body-right', defaultContent: 'NA'},
    {title: 'Assets', className: 'dt-body-right', defaultContent: 'NA'},
    {title: 'Liabilities & Stockholders Equity', defaultContent: 'NA'},
    {title: 'Net Income', defaultContent: 'NA'},
    {title: 'Profit', className: 'dt-body-right', defaultContent: 'NA'},
    {title: 'Revenues', className: 'dt-body-right', defaultContent: 'NA'},
    {title: 'Earnings', defaultContent: 'NA'}
  ],

  tableContent: function () {
    return _.map(this.get('model'), function (n) {
      console.log('NNN :: --> ', n);
      return [n.name, n.date, n.form, n.assets.value, n.liabilitiesAndStockholdersEquity.value, n.netIncome.value, n.profit.value, n.revenues.value, n.earnings.value];
    });
  }.property('model')
});

App.FinancialsView = App.GenericTableView.extend();

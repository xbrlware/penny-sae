// web/js/app/dropdown.js

/* global Ember, App, _, gconfig*/

App.DropdownController = Ember.ObjectController.extend({
  needs: ['application'],

  redFlagParams: Ember.computed.alias('controllers.application.redFlagParams'),

  symbology_select_content: [
    {id: undefined, name: 'Choose Type'},
    {id: 'name', name: 'Company Name'},
    {id: 'sic', name: 'SIC Code'},
    {id: 'ticker', name: 'Ticker'}
  ],
  crowdsar_select_content: {
    metric: [
      {id: undefined, name: 'Choose Metric'},
      {id: 'sum', name: 'Sum'},
      {id: 'mean', name: 'Mean'}
    ],
    field: [
      {id: undefined, name: 'Choose Field'},
      {id: 'n_posts', name: 'Number of Posts'},
      {id: 'tri_pred_neg', name: 'Dump Sentiment'},
      {id: 'tri_pred_pos', name: 'Pump Sentiment'}
    ]
  },
  financials_select_content: [
    {id: undefined, name: 'Choose Type'},
    {id: 'assets', name: 'Assets'},
    {id: 'liabilitiesAndStockholdersEquity', name: 'Liabilities and Stockholders Equity'},
    {id: 'netIncome', name: 'Net Income'},
    {id: 'profit', name: 'Profit'},
    {id: 'revenues', name: 'Revenues'},
    {id: 'earnings', name: 'Earnings'}
  ],
  late_filings_content: [
    {id: undefined, name: 'Choose Form'},
    {id: '10-K', name: '10-K'},
    {id: '10-Q', name: '10-Q'}
  ],

  empty: true,
  pv: false,
  symbology: false,
  otc_neighbors: false,
  financials: false,
  crowdsar: false,
  suspensions: false,
  delinquency: false,
  actions: {
    sort_companies: function () {
      var appCon = this.controllerFor('application');
      appCon.transitionToRoute('sidebar', '');
      appCon.transitionToRoute('sidebar', '-');
    },

    refresh_companies: function () {
      var appCon = this.controllerFor('application');
      appCon.transitionToRoute('sidebar', '');
      appCon.transitionToRoute('sidebar', '--');
    },

    showParameters: function (type) {
      this.set('empty', false);
      var self = this;
      _.map(_.keys(gconfig.DEFAULT_TOGGLES), function (feature) {
        try {
          self.set(feature, false);
        } catch (e) {
          console.error('dropdown.js :: ' + e.message);
        }
      });
      this.set(type, true);
    }
  }
});

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

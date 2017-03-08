import Ember from 'ember';
import _ from 'underscore';
import Gconfig from '../user-config/global-config';

export default Ember.Component.extend({
  searchCompanies: Ember.inject.service('search-companies'),
  redFlagParams: Ember.computed.alias('searchCompanies.redFlagParams'),
  empty: true,
  pv: false,
  symbology: false,
  otcNeighbors: false,
  financials: false,
  crowdsar: false,
  suspensions: false,
  delinquency: false,

  init: function () {
    this._super(...arguments);
    this.set('empty', false);
    this.set('pv', false);
    this.set('symbology', false);
    this.set('otcNeighbors', false);
    this.set('financials', false);
    this.set('crowdsar', false);
    this.set('suspensions', false);
    this.set('delinquency', false);
  },

  didInsertElement: function () {
    Ember.$('#big-dropdown-button').trigger('click.bs.dropdown');

    Ember.$('.dropdown-menu tr').click(function (e) {
      e.preventDefault();
    });

    Ember.$('#big-dropdown-button').on('click', function () {
      Ember.$(this).parent().toggleClass('open');
    });

    Ember.$('fa').click(function () {
      return false;
    });

    Ember.$('#compute-button').click(function () {
      return false;
    });

    Ember.$('#input-topic').click(function () {
      return false;
    });
  },

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

  actions: {
    sort_companies: function () {
      this.get('router').transitionTo('sidebar', '');
      this.get('router').transitionTo('sidebar', '-');
    },

    refresh_companies: function () {
      this.get('router').transitionTo('sidebar', '');
      this.get('router').transitionTo('sidebar', '--');
    },

    showParameters: function (type) {
      this.set('empty', false);
      var self = this;
      _.map(_.keys(Gconfig.DEFAULT_TOGGLES), function (feature) {
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

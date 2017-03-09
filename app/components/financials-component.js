// app/components/financials-component.js

import _ from 'underscore';
import SearchMixin from '../mixins/search-mixin';
import GenericTable from './generic-table';
import NiceNumber from '../utils/nice-number';

export default GenericTable.extend(SearchMixin, {
  tableDiv: '#financials-table',
  tableModel: undefined,
  cik: undefined,

  init: function () {
    this._super(...arguments);
    const _this = this;
    this.set('cik', this.get('tableCik'));
    this.get('fetchData')('financials', { cik: this.get('cik') }).then(function (response) {
      _this.set('tableModel', response.data);
    });
  },

  tableColumns: [
    {title: 'Company', className: 'dt-body-right', defaultContent: 'NA'},
    {title: 'Date', defaultContent: 'NA'},
    {title: 'Filing', className: 'dt-body-right', defaultContent: 'NA'},
    {title: 'Assets', className: 'dt-body-right', render: NiceNumber},
    {title: 'Liabilities & Stockholders Equity', render: NiceNumber},
    {title: 'Net Income', render: NiceNumber},
    {title: 'Profit', className: 'dt-body-right', render: NiceNumber},
    {title: 'Revenues', className: 'dt-body-right', render: NiceNumber},
    {title: 'Earnings', render: NiceNumber}
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

  dateConversion: function (d) {
    var date = new Date(d);
    return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
  },

  tableContent: function () {
    var this_ = this;
    return _.map(this.get('tableModel'), function (n) {
      return [n.name, this_.dateConversion(n.date), n.form,
        this_.smartGet(n.__meta__.financials, 'assets'),
        this_.smartGet(n.__meta__.financials, 'liabilitiesAndStockholdersEquity'),
        this_.smartGet(n.__meta__.financials, 'netIncome'),
        this_.smartGet(n.__meta__.financials, 'profit'),
        this_.smartGet(n.__meta__.financials, 'revenues'),
        this_.smartGet(n.__meta__.financials, 'earnings')
      ];
    });
  }.property('tableModel')
});

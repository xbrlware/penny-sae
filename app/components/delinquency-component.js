// app/components/delinquency-component.js

import _ from 'underscore';
import SearchMixin from '../mixins/search-mixin';
import GenericTable from './generic-table';

export default GenericTable.extend(SearchMixin, {
  tableDiv: '#delinquency-table',
  tableModel: undefined,
  cik: undefined,

  init: function () {
    this._super(...arguments);
    const _this = this;
    this.set('cik', this.get('tableCik'));
    this.get('fetchData')('delinquency', { cik: this.get('cik') }).then(function (response) {
      _this.set('tableModel', response.data);
    });
  },

  tableColumns: [
    {title: 'Form'},
    {title: 'Period of Filing', className: 'dt-body-right'},
    {title: 'Deadline', className: 'dt-body-right', defaultContent: 'NA'},
    {title: 'Date of Filing', className: 'dt-body-right'},
    {title: 'Late Filing', defaultContent: 'NA'}
  ],

  tableContent: function () {
    const _this = this;
    return _.map(this.get('tableModel'), function (n) {
      return [n.form,
        _this.dateConversion(n._enrich.period),
        n._enrich.deadline ? _this.dateConversion(n._enrich.deadline) : 'missing',
        _this.dateConversion(n.date), n._enrich.is_late ? 'Late' : ''
      ];
    });
  }.property('tableModel'),

  dateConversion: function (d) {
    let date = new Date(d);
    return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
  }
});

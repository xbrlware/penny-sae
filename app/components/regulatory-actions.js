// app/components/regulatory-actions.js

import GenericTable from './generic-table';
import SearchMixin from '../mixins/search-mixin';

export default GenericTable.extend(SearchMixin, {
  tableDiv: '#previous-reg-table',
  tableModel: undefined,
  cik: undefined,
  haveRecords: true,

  init: function () {
    this._super(...arguments);
    const _this = this;
    this.set('cik', this.get('tableCik'));
    this.get('fetchData')('suspensions', { cik: this.get('cik') }).then(function (response) {
      _this.set('tableModel', response.data);
      _this.set('haveRecords', response.data.length > 0);
    });
  },

  tableColumns: [
    {title: 'Company'},
    {title: 'Date', className: 'dt-body-right'},
    {title: 'Release Number'},
    {title: 'Link'}
  ],

  tableContent: function () {
    var m = this.get('tableModel');
    if (m) {
      return m.map(function (x) {
        return [
          x.company,
          x.date,
          x.release_number,
          x.link
        ];
      });
    }
  }.property('tableModel')
});

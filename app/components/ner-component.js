// app/components/ner-component.js

import _ from 'underscore';
import GenericTable from './generic-table';

export default GenericTable.extend({
  edges: undefined,
  tableDiv: undefined,

  didRender: function () {
    this.set('edges', this.get('rGraphEdges'));
    this.set('tableDiv', '#associates-table');
  },

  tableContent: function () {
    return _.map(this.get('edges'), function (x) {
      return [
        x.data.issuerName,
        x.data.ownerName,
        x.data.issuerCik,
        x.data.ownerCik,
        x.data.min_date ? x.data.min_date.split('-').join('/') : null,
        x.data.max_date ? x.data.max_date.split('-').join('/') : null,
        x.data.isDirecto === 1 ? 'X' : '',
        x.data.isOfficer === 1 ? 'X' : '',
        x.data.isTenPercentOwner === 1 ? 'X' : ''
      ];
    });
  }.property('edges'),

  tableColumns: [
    {title: 'Issuer Name'},
    {title: 'Owner Name'},
    {title: 'Issuer CIK'},
    {title: 'Owner CIK'},
    {title: 'From'},
    {title: 'To'},
    {title: 'Director'},
    {title: 'Officer'},
    {title: '10% Owner'}
  ]
});

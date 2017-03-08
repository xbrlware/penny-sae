// app/components/generic-table.js

import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement: function () {
    this._super();
    Ember.run.scheduleOnce('afterRender', this, this.renderTable);
  },

  contentChanged: function () {
    this.renderTable();
  }.observes('tableContent'),

  renderTable: function () {
    const _this = this;
    let ele = Ember.$(this.get('tableDiv'));
    console.log('ELEMENT :: ', this.get('tableDiv'));
    Ember.$(ele).empty();
    Ember.$(ele).DataTable({
      fnDrawCallback: function (oSettings) {
        if (oSettings._iDisplayLength > oSettings._iRecordsDisplay) {
          Ember.$(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
        }
      },
      fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        if (aData[4] === 'Late' && ele === '#delinquency-table') {
          Ember.$(nRow).css('color', 'red');
        }
      },
      destroy: true,
      data: _this.get('tableContent'),
      columns: _this.tableColumns,
      pageLength: 50
    });
  }
});

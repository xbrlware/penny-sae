/* global App, Ember */

App.GenericTableView = Ember.View.extend({
  didInsertElement: function () {
    this._super();
    Ember.run.scheduleOnce('afterRender', this, this.renderTable);
  },

  contentChanged: function () {
    this.renderTable();
  }.observes('controller.tableContent'),

  renderTable: function () {
    var con = this.get('controller');
    var ele = Ember.$(con.get('tableDiv'));
    Ember.$(ele).empty();
    Ember.$(con.get('tableDiv')).DataTable({
      fnDrawCallback: function (oSettings) {
        if (oSettings._iDisplayLength > oSettings._iRecordsDisplay) {
          Ember.$(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
        }
      },
      fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        if (aData[4] === 'Late' && con.get('tableDiv') === '#delinquency-table') {
          Ember.$(nRow).css('color', 'red');
        }
      },
      destroy: true,
      data: con.get('tableContent'),
      columns: con.tableColumns,
      pageLength: 50
    });
  }
});

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
    Ember.$(con.get('tableDiv')).DataTable({
      fnDrawCallback: function (oSettings) {
        if (oSettings._iDisplayLength > oSettings.fnRecordsDisplay()) {
          Ember.$(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
        }
      },
      destroy: true,
      data: con.get('tableContent'),
      columns: con.tableColumns,
      pageLength: 50
    });
  }
});

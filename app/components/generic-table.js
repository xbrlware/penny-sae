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
    Ember.$(ele).empty();
    Ember.$(ele).DataTable({
      fnRowCallback: function (nRow, aData) {
        if (aData[4] === 'Late' && ele[0].id === 'delinquency-table') {
          Ember.$(nRow).css('color', 'red');
        }
      },
      destroy: true,
      searching: false,
      data: _this.get('tableContent'),
      columns: _this.tableColumns,
      pageLength: 50
    });
  }
});

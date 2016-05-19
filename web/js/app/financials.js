// web/js/app/financials.js

/* global Ember, App, _ */

App.FinancialsRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    App.Search.get_generic_detail('financials', this.get('controller.name')).then(function (response) {
      controller.set('model', response.data);
    });
  }
});

App.FinancialsController = Ember.Controller.extend({
  needs: ['detail'],
  name: Ember.computed.alias('controllers.detail.model'),

  tableColumns: [
    {title: 'Balance Sheet', defaultContent: '', className: 'dt-body-right'},
    {title: 'Filing', defaultContent: '', className: 'dt-body-right'},
    {title: 'Fiscal Year End', defaultContent: '', className: 'dt-body-right'},
    {title: 'Revenues', defaultContent: '', className: 'dt-body-right'},
    {title: 'Net Income', defaultContent: '', className: 'dt-body-right'},
    {title: 'Assets', defaultContent: '', className: 'dt-body-right'}
  ],

  tableContent: function () {
    return _.map(this.get('model'), function (n) {
      return [ n.bsd, n.type, n.fy, n.revenues_pretty, n.netincome_pretty, n.assets_pretty];
    });
  }.property('model.@each')
});

// ** Could merge this with DelinquencyView **
App.FinancialsView = Ember.View.extend({
  tableDiv: '#financials-table',

  didInsertElement: function () {
    this._super();
    Ember.run.scheduleOnce('afterRender', this, this.renderTable);
  },

  contentChanged: function () {
    this.renderTable();
  }.observes('controller.tableContent'),

  renderTable: function () {
    var con = self.get('controller');
    Ember.$(this.tableDiv).DataTable({
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

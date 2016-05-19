// web/js/app/delinquency.js
/* global Ember, App, _ */

// Delinquency

App.DelinquencyRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    App.Search.get_generic_detail('delinquency', this.get('controller.name')).then(function (response) {
      controller.set('model', response.data);
    });
  }
});

App.DelinquencyController = Ember.Controller.extend(Ember.SortableMixin, {
  needs: ['detail'],
  name: Ember.computed.alias('controllers.detail.model'),

  tableColumns: [
    {title: 'Date of Filing', className: 'dt-body-right'},
    {title: 'Deadline', className: 'dt-body-right'},
    {title: 'Form'},
    {title: 'Late Filing'}
  ],

  tableContent: function () {
    return _.map(this.get('model'), function (n) {
      return [n.date, n._enrich.deadline, n.form, n._enrich.is_late];
    });
  }.property('model'),

  // *** What is this doing ***
  actions: {
    sortBy: function (property) {
      if (property === this.get('sortProperties')[0]) {
        this.toggleProperty('sortAscending');
      } else {
        this.set('sortAscending', true);
      }
      this.set('sortProperties', [property]);
    }
  }
});

// ** Could merge this with FinancialView **
App.DelinquencyView = Ember.View.extend({
  tableDiv: '#delinquency-table',

  didInsertElement: function () {
    this._super();
    Ember.run.scheduleOnce('afterRender', this, this.renderTable);
  },

  contentChanged: function () {
    this.renderTable();
  }.observes('controller.tableContent'),

  renderTable: function () {
    var con = this.get('controller');

    var table = Ember.$(this.tableDiv).DataTable({
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
    con.set('table', table);
  }
});

// web/js/app/delinquency.js
/* global Ember, App, _ */

// Delinquency

App.DelinquencyRoute = Ember.Route.extend({
  model: function () {
    var delinquencyTable = this.modelFor('detail').get('delinquencyTable');
    return delinquencyTable;
  }
});

App.DelinquencyView = Ember.View.extend({
  didInsertElement: function () {
    this._super();
    Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
  },

  afterRenderEvent: function () {
    var self = this;
    var con = self.get('controller');
    Ember.$('#delinquency-table').DataTable({
      fnDrawCallback: function (oSettings) {
        if (oSettings._iDisplayLength > oSettings.fnRecordsDisplay()) {
          Ember.$(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
        }
      },
      retrieve: true,
      data: con.tableContent(),
      columns: con.tableColumns(),
      pageLength: 50
    });
  }
});

App.DelinquencyController = Ember.Controller.extend(Ember.SortableMixin, {
  tableColumns: function () {
    return [
      {title: 'Date of Filing', className: 'dt-body-right'},
      {title: 'Due Date', className: 'dt-body-right'},
      {title: 'Form'},
      {title: 'Late Filing'}
    ];
  },

  tableContent: function () {
    var content = [];
    _.map(this.get('model'), function (n) {
      content.pushObject([n.dof, n.dd, n.form, n.std_late]);
    });
    return content;
  },

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

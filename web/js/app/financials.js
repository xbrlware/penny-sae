// web/js/app/financials.js

// Financials

App.FinancialsRoute = Ember.Route.extend({
  model: function () {
    var financialsTable = this.modelFor('detail').get('financialsTable')
    return financialsTable
  }
})

App.FinancialsView = Ember.View.extend({
  didInsertElement: function () {
    this._super()
    Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent)
  },

  afterRenderEvent: function () {
    var self = this
    var con = self.get('controller')
    Ember.$('#financials-table').DataTable({
      fnDrawCallback: function (oSettings) {
        if (oSettings._iDisplayLength > oSettings.fnRecordsDisplay()) {
          $(oSettings.nTableWrapper).find('.dataTables_paginate').hide()
        }
      },
      retrieve: true,
      data: con.tableContent(),
      columns: con.tableColumns(),
      pageLength: 50
    })
  }
})

App.FinancialsController = Ember.Controller.extend({
  tableColumns: function () {
    return [
      {title: 'Balance Sheet', defaultContent: '', className: 'dt-body-right'},
      {title: 'Filing', defaultContent: '', className: 'dt-body-right'},
      {title: 'Fiscal Year End', defaultContent: '', className: 'dt-body-right'},
      {title: 'Revenues', defaultContent: '', className: 'dt-body-right'},
      {title: 'Net Income', defaultContent: '', className: 'dt-body-right'},
      {title: 'Assets', defaultContent: '', className: 'dt-body-right'}
    ]
  },

  tableContent: function () {
    var m = this.get('model')
    var content = []
    _.map(m, function (n) {
      content.pushObject([
        n.bsd,
        n.type,
        n.fy,
        n.revenues_pretty,
        n.netincome_pretty,
        n.assets_pretty
      ])
    })
    return content
  }
})

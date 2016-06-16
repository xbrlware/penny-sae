// web/js/app/financials.js

/* global Ember, App, _ */

App.FinancialsRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    App.Search.fetch_data('financials', this.get('controller.name')).then(function (response) {
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
      return [n.bsd, n.type, n.fy, n.revenues_pretty, n.netincome_pretty, n.assets_pretty];
    });
  }.property('model.@each')
});

App.FinancialsView = App.GenericTableView.extend();

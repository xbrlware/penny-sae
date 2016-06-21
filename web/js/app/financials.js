// web/js/app/financials.js

/* global Ember, App, _ */

App.FinancialsRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    App.Search.fetch_data('financials', this.get('controller.name')).then(function (response) {
      controller.set('model', response);
      console.log(response);
    });
  }
});

App.FinancialsController = Ember.Controller.extend({
  needs: ['detail'],
  name: Ember.computed.alias('controllers.detail.model'),
  tableDiv: '#financials-table',
  tableColumns: [
    {title: 'Company', defaultContent: '', className: 'dt-body-right'},
    {title: 'Filing', defaultContent: '', className: 'dt-body-right'},
    {title: 'URL', defaultContent: '', className: 'dt-body-right'}
  ],

  tableContent: function () {
    return _.map(this.get('model'), function (n) {
      return [n.name, n.form, n.url];
    });
  }.property('model')
});

App.FinancialsView = App.GenericTableView.extend();

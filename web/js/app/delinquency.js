// web/js/app/delinquency.js
/* global Ember, App, _ */

// Delinquency

App.DelinquencyRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    App.Search.fetch_data('delinquency', this.get('controller.name')).then(function (response) {
      controller.set('model', response.data);
    });
  }
});

App.DelinquencyController = Ember.Controller.extend(Ember.SortableMixin, {
  needs: ['detail'],
  name: Ember.computed.alias('controllers.detail.model'),

  tableDiv: '#delinquency-table',
  tableColumns: [
    {title: 'Date of Filing', className: 'dt-body-right'},
    {title: 'Deadline', className: 'dt-body-right'},
    {title: 'Form'},
    {title: 'Late Filing'}
  ],

  tableContent: function () {
    return _.map(this.get('model'), function (n) {
      return [n.date, n._enrich.deadline || 'missing', n.form, n._enrich.is_late];
    });
  }.property('model'),
});

App.DelinquencyView = App.GenericTableView.extend();

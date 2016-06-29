// web/js/app/delinquency.js
/* global Ember, App, _ */

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
    {title: 'Form'},
    {title: 'Period of Filing', className: 'dt-body-right'},
    {title: 'Deadline', className: 'dt-body-right', defaultContent: 'NA'},
    {title: 'Date of Filing', className: 'dt-body-right'},
    {title: 'Late Filing', defaultContent: 'NA'}
  ],

  tableContent: function () {
    return _.map(this.get('model'), function (n) {
      return [
        n.form,
        n._enrich.period.split('-').join('/'),
        (n._enrich.deadline || 'missing').split('-').join('/'),
        n.date.split('-').join('/'),
        n._enrich.is_late ? 'Late' : ''
      ];
    });
  }.property('model')
});

App.DelinquencyView = App.GenericTableView.extend();
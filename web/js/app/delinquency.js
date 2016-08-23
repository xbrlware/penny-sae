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
    var _this = this;
    return _.map(this.get('model'), function (n) {
      return [n.form, _this.dateConversion(n._enrich.period), n._enrich.deadline ? _this.dateConversion(n._enrich.deadline) : 'missing', _this.dateConversion(n.date), n._enrich.is_late ? 'Late' : ''];
    });
  }.property('model'),

  dateConversion: function (d) {
    var date = new Date(d);
    return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
  }
});

App.DelinquencyView = App.GenericTableView.extend();

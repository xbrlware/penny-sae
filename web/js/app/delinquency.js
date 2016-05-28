// web/js/app/delinquency.js
/* global Ember, App, _ */

// Delinquency

App.DelinquencyRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    App.Search.fetch_data('delinquency', this.get('controller.name')).then(function (response) {
      console.log('delinquency data', response);
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
      return [n.date, n._enrich.deadline || 'missing', n.form, n._enrich.is_late || 'missing'];
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

App.DelinquencyView = App.GenericTableView.extend();

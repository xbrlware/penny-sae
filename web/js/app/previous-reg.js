// web/js/app/previous-reg.js

/* global Ember, App */

// Previous Regulatory Actions

App.PreviousRegRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    App.Search.fetch_data('suspensions', controller.get('name')).then(function (response) {
      controller.set('model', response.data);
      controller.set('have_records', response.data.length > 0);
    });
  }
});

App.PreviousRegController = Ember.Controller.extend({
  needs: ['detail'],
  name: Ember.computed.alias('controllers.detail.model'),
  have_records: true,

  tableDiv: '#previous-reg-table',
  tableColumns: [
    {title: 'Company'},
    {title: 'Date', className: 'dt-body-right'},
    {title: 'Release Number'},
    {title: 'Link'}
  ],

  tableContent: function () {
    var m = this.get('model');
    if (m) {
      return m.map(function (x) {
        return [x.company, x.date, x.release_number, x.link];
      });
    }
  }.property('model')
});

App.PreviousRegView = App.GenericTableView.extend();

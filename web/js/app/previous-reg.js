// web/js/app/previous-reg.js

/* global Ember, App */

// Previous Regulatory Actions

App.PreviousRegRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    console.log('setupController', 'previousRegRoute');
    App.Search.get_generic_detail('suspensions', controller.get('name')).then(function (response) {
      console.log('suspensions reseponse', response.data);
      controller.set('model', response.data);
      controller.set('have_records', response.data.length > 0);
    });
  }
});

App.PreviousRegController = Ember.Controller.extend({
  needs: ['detail'],
  name: Ember.computed.alias('controllers.detail.model'),
  have_records: true
});

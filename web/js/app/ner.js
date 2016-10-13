// web/js/app/ner.js

/* global Ember, App, _ */

// Named Entity Recognition View

function fetchNer (args) {
  Ember.$.ajax({
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    url: 'fetchNer',
    data: JSON.stringify({'cik': args.cik, 'showHidden': args.showHidden}),
    success: args.callback,
    error: function (xhr, status, error) {
      console.error('ner.js :: ' + error.message);
    }
  });
}

function setNer (args) {
  Ember.$.ajax({
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    url: 'setNer',
    data: JSON.stringify({'cik': args.cik, 'data': args.data}),
    success: args.callback,
    error: function (xhr, status, error) {
      console.error('ner.js :: ' + error.message);
    }
  });
}

App.Ner = Ember.Object.extend({
  cik: undefined,
  data: []
});

App.NerRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    var cik = this.modelFor('detail').get('cik');
    controller.set('cik', cik);
  }
});

App.NerController = Ember.Controller.extend({
  showHidden: false,
  toggled_hidden: function () {
  }.observes('showHidden'),
  getNer: function (cik, showHidden) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      fetchNer({
        'cik': cik,
        'showHidden': showHidden,
        'callback': function (nerData) {
          if (nerData[0] !== undefined) {
            var ner = App.Ner.create();

            var objs = [];
            _.map(nerData, function (x) {
              objs.push(Ember.Object.create(x));
            });

            ner.set('cik', cik);
            ner.set('data', objs);

            resolve(ner);
          } else {
            resolve(undefined);
          }
        }
      });
    });
  },
  update_model: function (model) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      setNer({
        'cik': model.get('cik'),
        'data': model.get('data'),
        'callback': function (response) {
          resolve();
        }
      });
    });
  }
});

App.NerView = Ember.View.extend({
  templateName: 'ner',
  didInsertElement: function () {
  }
});

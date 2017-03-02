// web/js/app/controllers/ner.js
/* global Ember, App, _, fetchNer, setNer */

'use strict';

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

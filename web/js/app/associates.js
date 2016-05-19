// web/js/app/associates.js
/* global Ember, App, _, gconfig, alert */

App.AssociatesRoute = Ember.Route.extend({
  model: function () {
    return this.modelFor('detail');
  }
});

App.AssociatesController = Ember.ObjectController.extend({
  needs: ['application'],

  redFlagParams: Ember.computed.alias('controllers.application.redFlagParams'),

  hide_terminal: gconfig.DEFAULT_HIDE_TERMINAL,
  hide_ner: gconfig.DEFAULT_HIDE_NER,

  rgraph_json: null,
  rgraph_object: null,
  networkAssociates: null,
  origNetworkAssociates: null,

  rgraph_origin: null,
  origAdj: [],
  links: [],

  dummy_variable: 'test',
  refresh: 0,

  searchTermEr: '',

  set_ner: function (args) {
    Ember.$.ajax({
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      url: 'set_ner',
      data: JSON.stringify({'cik': args.cik, 'updates': args.updates}),
      success: args.callback,
      error: function (xhr, status, error) {
        console.log('Error: ' + error.message);
      }
    });
  },

  update_networkAssociates: function (updates) {
    var self = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      self.set_ner({
        'cik': self.get('model.cik'),
        'updates': updates,
        'callback': function (response) {
          self.transitionToRoute('previousReg');
          setTimeout(function () {
            self.transitionToRoute('associates');
          }, 50);
          alert('Changes saved successfully!');
          resolve();
        }
      });
    });
  },
  actions: {
    toggle_ner: function (ner) {
      var networkAssociates = this.get('networkAssociates');
      var ind = _.indexOf(networkAssociates, ner);
      var associate = networkAssociates[ind];

      associate.toggleProperty('hidden');
    },
    save_toggles: function () {
      var networkAssociates = this.get('networkAssociates');
      var updates = _.map(networkAssociates, function (associate) {
        return {'nodeTo': associate.id, 'hidden': associate.hidden};
      });
      this.update_networkAssociates(updates);
    },
    filter_er: function () {
      var searchTermEr = this.get('searchTermEr');
      var origNetworkAssociates = this.get('origNetworkAssociates');
      if (searchTermEr === '') {
        this.set('networkAssociates', origNetworkAssociates);
      } else {
        this.set('networkAssociates', _.filter(origNetworkAssociates, function (associate) {
          var name = associate.name;
          return name.match(new RegExp(searchTermEr, 'i')) != null;
        }));
      }
    },

    show_links_ner: function (ner) {
      var origAdj = this.get('origAdj');
      var cik = this.get('model.cik');
      var edge = _.where(origAdj, {'nodeTo': ner.id})[0];
      this.set('links', _.map(edge.data.an, function (x) {
        var link = 'http://www.sec.gov/Archives/edgar/data/' + cik + '/' + x + '-index.htm';
        return {link: link};
      }));
    }
  }
});

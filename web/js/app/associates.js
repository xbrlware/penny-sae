// web/js/app/associates.js
/* global Ember, App, _, gconfig */

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

  // >>
  // For table

  rGraphEdges: [],
  update_data: function (rgraph) {
    var rGraphEdges = _.chain(rgraph.graph.edges).map(function (v1, source) {
      return _.chain(v1).map(function (edge, target) {
        return {'source': source, 'target': target, 'data': edge.data};
      }).filter(function (x) { return x.source === x.data.ownerCik; }).value();
    }).flatten().value();
    this.set('rGraphEdges', rGraphEdges);
  },

  tableDiv: '#associates-table',
  tableContent: function () {
    return _.map(this.get('rGraphEdges'), function (x) {
      return [
        x.data.issuerName,
        x.data.ownerName,
        x.data.issuerCik,
        x.data.ownerCik,
        x.data.min_date ? x.data.min_date.split('-').join('/') : null,
        x.data.max_date ? x.data.max_date.split('-').join('/') : null,
        x.data.isDirecto === 1 ? 'X' : '',
        x.data.isOfficer === 1 ? 'X' : '',
        x.data.isTenPercentOwner === 1 ? 'X' : ''
      ];
    });
  }.property('rGraphEdges'),

  tableColumns: [
    {title: 'Issuer Name'},
    {title: 'Owner Name'},
    {title: 'Issuer CIK'},
    {title: 'Owner CIK'},
    {title: 'From'},
    {title: 'To'},
    {title: 'Director'},
    {title: 'Officer'},
    {title: '10% Owner'}
  ]
});

App.AssociatesView = App.GenericTableView.extend();

// ** vv Do we need any of this stuff? vv **

//  rgraph_json: null,
//  rgraph_object: null,
//  networkAssociates: null,
//  origNetworkAssociates: null,
//
//  rgraph_origin: null,
//  origAdj: [],
//  links: [],
//
//  dummy_variable: 'test',
//  refresh: 0,
//
//  searchTermEr: '',
//
//  set_ner: function (args) {
//    Ember.$.ajax({
//      type: 'POST',
//      contentType: 'application/json',
//      dataType: 'json',
//      url: 'set_ner',
//      data: JSON.stringify({'cik': args.cik, 'updates': args.updates}),
//      success: args.callback,
//      error: function (xhr, status, error) {
//        console.log('Error: ' + error.message)
//      }
//    })
//  },
//
//  update_networkAssociates: function (updates) {
//    var self = this
//    return new Ember.RSVP.Promise(function (resolve, reject) {
//      self.set_ner({
//        'cik': self.get('model.cik'),
//        'updates': updates,
//        'callback': function (response) {
//          self.transitionToRoute('previousReg')
//          setTimeout(function () {
//            self.transitionToRoute('associates')
//          }, 50)
//          alert('Changes saved successfully!')
//          resolve()
//        }
//      })
//    })
//  },
//  actions: {
//    toggle_ner: function (ner) {
//      var networkAssociates = this.get('networkAssociates')
//      var ind = _.indexOf(networkAssociates, ner)
//      var associate = networkAssociates[ind]
//
//      associate.toggleProperty('hidden')
//    },
//    save_toggles: function () {
//      var networkAssociates = this.get('networkAssociates')
//      var updates = _.map(networkAssociates, function (associate) {
//        return {'nodeTo': associate.id, 'hidden': associate.hidden}
//      })
//      this.update_networkAssociates(updates)
//    },
//    filter_er: function () {
//      var searchTermEr = this.get('searchTermEr')
//      var origNetworkAssociates = this.get('origNetworkAssociates')
//      if (searchTermEr === '') {
//        this.set('networkAssociates', origNetworkAssociates)
//      } else {
//        this.set('networkAssociates', _.filter(origNetworkAssociates, function (associate) {
//          var name = associate.name
//          return name.match(new RegExp(searchTermEr, 'i')) != null
//        }))
//      }
//    },
//
//    show_links_ner: function (ner) {
//      var origAdj = this.get('origAdj')
//      var cik = this.get('model.cik')
//      var edge = _.where(origAdj, {'nodeTo': ner.id})[0]
//      this.set('links', _.map(edge.data.an, function (x) {
//        var link = 'http://www.sec.gov/Archives/edgar/data/' + cik + '/' + x + '-index.htm'
//        return {link: link}
//      }))
//    }
//  }
// })

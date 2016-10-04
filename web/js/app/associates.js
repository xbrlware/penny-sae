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

  rGraphEdges: [],
  updateData: function (rgraph) {
    var rGraphEdges = [];
    if (rgraph) {
      rGraphEdges = _.chain(rgraph.graph.edges).map(function (v1, source) {
        return _.chain(v1).map(function (edge, target) {
          return {'source': source, 'target': target, 'data': edge.data};
        }).filter(function (x) { return x.source === x.data.ownerCik; }).value();
      }).flatten().value();
      this.set('rGraphEdges', rGraphEdges);
    }
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

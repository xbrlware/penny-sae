// web/js/app/associates.js
/* global Ember, App, _ */

App.AssociatesRoute = Ember.Route.extend({
  model: function () {
    return this.modelFor('detail');
  }
});

App.AssociatesController = Ember.ObjectController.extend({
  needs: ['application'],
  redFlagParams: Ember.computed.alias('controllers.application.redFlagParams'),
  isLoading: false,
  noData: false,
  rGraphEdges: [],

  zpad: function (x, n) {
    n = n | 10;
    if (x.length < n) {
      return this.zpad('0' + x, n);
    } else {
      return x;
    }
  },

  fetch: function (params, cb) {
    Ember.$.ajax({
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      url: 'network',
      data: JSON.stringify(params),
      success: cb
    });
  },

  expand_node: function (con, cik, redFlagParams, init) {
    cik = this.zpad(cik.toString());
    this.fetch({'cik': cik, 'redFlagParams': redFlagParams.get_toggled_params()}, function (data) {
      con.set('rgraph', data);
      con.update_data(data);
    });
  },

  update_data: function (rgraph) {
    var rGraphEdges = _.map(rgraph.edges, function (v1) {
      return {'source': v1.issuerCik, 'target': v1.ownerCik, 'data': v1};
    });
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

App.AssociatesView = App.GenericTableView.extend({
  didInsertElement: function () { this.draw(); },
  controllerChanged: function () { this.draw(); }.observes('controller.model'),
  draw: function () {
    var con = this.get('controller');
    var cik = con.get('content.cik');
    var redFlagParams = con.get('redFlagParams');

    con.expand_node(con, cik, redFlagParams, true);
  }
});

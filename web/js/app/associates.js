// web/js/app/associates.js
/* global Ember, App, d3, _ */

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
  didInsertElement: function () {
    this.expand_node();
  },

  controllerChanged: function () {
    this.expand_node();
  }.observes('controller.model'),

  draw: function (data) {
    var nodes = {};

    data.edges.forEach(function (x) {
      x.source = nodes[x.issuerName] || (nodes[x.issuerName] = {name: x.issuerName,
        'cik': x.issuerCik,
        'issuer': 1});
      x.target = nodes[x.ownerName] || (nodes[x.ownerName] = {name: x.ownerName,
        'cik': x.ownerCik,
        'issuer': 0});
    });

    console.log('DATA :: ', data);
    console.log('NODE :: ', nodes);
    var width = 800;
    var height = 400;

    var force = d3.layout.force()
      .nodes(d3.values(nodes))
      .links(data.edges)
      .size([width, height])
      .linkDistance(60)
      .charge(-300)
      .on('tick', tick)
      .start();

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-5, 0])
      .html(function (d) {
        return '<center><span>' + d.name + '</span><br /><span>' + d.cik + '</center>';
      });

    var svg = d3.select('.network-graph').append('svg')
      .attr('width', width)
      .attr('height', height);

    var link = svg.selectAll('.link')
      .data(force.links())
      .enter()
      .append('line')
      .attr('class', 'link');

    var node = svg.selectAll('.node')
      .data(force.nodes())
      .enter()
      .append('g')
      .attr('class', 'node')
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .call(force.drag)
      .call(tip);

    node.append('image')
      .attr('class', 'circle')
      .attr('xlink:href', function (d) {
        return getImage(d);
      })
      .attr('x', '-10px')
      .attr('y', '-10px')
      .attr('width', '20px')
      .attr('height', '20px');

    function tick () {
      link
        .attr('x1', function (d) { return d.source.x; })
        .attr('y1', function (d) { return d.source.y; })
        .attr('x2', function (d) { return d.target.x; })
        .attr('y2', function (d) { return d.target.y; });

      node
        .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')'; });
    }

    function getImage (d) {
      if (d) {
        console.log(d);
        if (d.issuer === 0) {
          return 'img/green_person.png';
        } else {
          return 'img/green_building.png';
        }
      }
    }
  },

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

  expand_node: function () {
    var _this = this;
    var cik = this.get('content.cik');
    var redFlagParams = this.get('redFlagParams');
    var zCik = this.zpad(cik.toString());

    this.fetch({'cik': zCik, 'redFlagParams': redFlagParams.get_toggled_params()}, function (data) {
      _this.set('rgraph', data);
      _this.update_data(data);
      _this.draw(data);
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

App.AssociatesView = App.GenericTableView.extend({});

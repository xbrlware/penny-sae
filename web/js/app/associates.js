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
    /* make sure that any previously existing graph is removed */
    d3.select('.network-graph').selectAll('svg').remove();
    var nodes = {};
    /* parse data for graph */
    data.forEach(function (x) {
      x.source = nodes[x.issuerName] || (nodes[x.issuerName] = {
        'name': x.issuerName,
        'cik': x.issuerCik,
        'issuer': 1,
        'red_flags': x.node.data.redFlags,
        'isDirector': x.isDirector,
        'isOfficer': x.isOfficer,
        'isTenPercentOwner': x.isTenPercentOwner
      });
      x.target = nodes[x.ownerName] || (nodes[x.ownerName] = {
        'name': x.ownerName,
        'cik': x.ownerCik,
        'issuer': 0,
        'red_flags': x.node.data.redFlags,
        'isDirector': x.isDirector,
        'isOfficer': x.isOfficer,
        'isTenPercentOwner': x.isTenPercentOwner
      });
    });

    /* default size for network graph */
    var width = 800;
    var height = 400;

    /* set up graph properties */
    var force = d3.layout.force()
      .nodes(d3.values(nodes))
      .links(data)
      .size([width, height])
      .linkDistance(60)
      .charge(-300)
      .on('tick', tick)
      .start();

    /* set up node tool tip */
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-5, 0])
      .html(function (d) {
        var cats = ['name', 'cik', 'red_flags', 'isDirector', 'isOfficer', 'isTenPercentOwner'];
        var htmlString = '';
        for (var key in d) {
          if (cats.indexOf(key) !== -1) {
            switch (key) {
              case 'name':
                htmlString += '<span>Name: ' + d[key] + '</span><br />';
                break;
              case 'cik':
                htmlString += '<span>CIK: ' + d[key] + '</span><br />';
                break;
              case 'red_flags':
                if (d[key].possible) {
                  htmlString += '<span>Red Flags: ' + (d[key].total ? d[key].total : '0') + '/' + d[key].possible + '</span><br />';
                }
                break;
              case 'isDirector':
                if (d[key] === 1) {
                  htmlString += '<span>Director</span><br />';
                }
                break;
              case 'isOfficer':
                if (d[key] === 1) {
                  htmlString += '<span>Officer</span><br />';
                }
                break;
              case 'isTenPercentOwner':
                if (d[key] === 1) {
                  htmlString += '<span>Ten Percent Owner</span><br />';
                }
                break;
              default:
                htmlString += '<span>' + key + ': ' + d[key] + '</span><br />';
            }
          }
        }
        return htmlString;
      });

    /* start svg tree */
    var svg = d3.select('.network-graph').append('svg')
      .attr('width', width)
      .attr('height', height);

    /* init links */
    var link = svg.selectAll('.link')
      .data(force.links())
      .enter()
      .append('line')
      .attr('class', 'link');

    /* init nodes */
    var node = svg.selectAll('.node')
      .data(force.nodes())
      .enter()
      .append('g')
      .attr('class', 'node')
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .call(force.drag)
      .call(tip);

    /* append icons instead of circles */
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
      /* which color icon to add to graph */
      if (d) {
        console.log(d);
        if (d.issuer === 0) {
          /* if issuer */
          if (d.red_flags.total) {
            if (d.red_flags.total === d.red_flags.possible) {
              /* matches all red flags */
              return 'img/red_person.png';
            } else {
              /* only matches some */
              return 'img/yellow_person.png';
            }
          } else {
            /* matches none */
            return 'img/green_person.png';
          }
        } else {
          if (d.red_flags.total) {
            if (d.red_flags.total === d.red_flags.possible) {
              return 'img/red_building.png';
            } else {
              return 'img/yellow_building.png';
            }
          } else {
            return 'img/green_building.png';
          }
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
      data.edges.forEach(function (edge) {
        return _.map(data.nodes, function (node) {
          if (node.id === edge.ownerCik) {
            edge['node'] = node;
            return edge;
          }
        });
      });
      console.log(data);
      _this.set('rgraph', data.edges);
      _this.update_data(data.edges);
      _this.draw(data.edges);
    });
  },

  update_data: function (rgraph) {
    var rGraphEdges = _.map(rgraph, function (edges) {
      return {'data': edges};
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

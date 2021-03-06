// app/components/associates-component.js
/* global d3 */

import Ember from 'ember';
import _ from 'underscore';
import NerObject from '../objects/ner-object';
import GenericTable from './generic-table';

export default GenericTable.extend({
  searchCompanies: Ember.inject.service('search-companies'),
  redFlagParams: Ember.computed.alias('searchCompanies.redFlagParams'),
  associatesModel: undefined,
  isLoading: undefined,
  noData: undefined,
  terminalToggle: undefined,
  rGraphEdges: undefined,
  showHidden: undefined,

  init: function () {
    this._super(...arguments);
    this.set('associatesModel', Ember.Object.create({
      cik: this.get('initModel'),
      data: undefined,
      rgrpah: undefined
    }));
    this.set('isLoading', false);
    this.set('noData', false);
    this.set('terminalToggle', false);
    this.set('rGraphEdges', Ember.A([]));
    this.set('showHidden', false);
  },

  didInsertElement: function () {
    this.expandNode();
  },

  modelChanged: function () {
    this.expandNode();
  }.observes('associatesModel'),

  toggled_hidden: function () {
  }.observes('showHidden'),

  fetchNer: function (args) {
    Ember.$.ajax({
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      url: '/fetchNer',
      data: JSON.stringify({'cik': args.cik, 'showHidden': args.showHidden}),
      success: args.callback,
      error: function (xhr, status, error) {
        console.error('ner.js :: ' + error.message);
      }
    });
  },

  setNer: function (args) {
    Ember.$.ajax({
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      url: '/setNer',
      data: JSON.stringify({'cik': args.cik, 'data': args.data}),
      success: args.callback,
      error: function (xhr, status, error) {
        console.error('ner.js :: ' + error.message);
      }
    });
  },

  getNer: function (cik, showHidden) {
    return new Ember.RSVP.Promise(function (resolve) {
      this.fetchNer({
        'cik': cik,
        'showHidden': showHidden,
        'callback': function (nerData) {
          if (nerData[0] !== undefined) {
            var ner = NerObject.create();

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
    return new Ember.RSVP.Promise(function (resolve) {
      this.setNer({
        'cik': model.get('cik'),
        'data': model.get('data'),
        'callback': function () {
          resolve();
        }
      });
    });
  },

  draw: function (data, w, h) {
    /* check if any data came in */
    if (data.length < 1) {
      this.set('noData', true);
      return;
    } else {
      this.set('noData', false);
    }

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
    var width = w || 1000;
    var height = h || 400;

    /* set up graph properties */
    var force = d3.layout.force()
      .nodes(d3.values(nodes))
      .links(data)
      .size([width, height])
      .linkDistance(30)
      .charge(-300)
      .on('tick', tick)
      .start();

    var zoom = d3.behavior.zoom()
      .scaleExtent([0.3, 10])
      .on('zoom', zoomed);

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
                  htmlString += '<span>Red Flags: ' + (d[key].total ? d[key].total : '0') + '</span><br />';
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
        return htmlString || '<span>N/A</span>';
      });

    /* start svg tree */
    var svg = d3.select('.network-graph').append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'network-background')
      .call(zoom)
      .append('g');

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
      .on('dblclick.zoom', function (d) {
        d3.event.stopPropagation();
        var dcx = (width / 2 - d.x * zoom.scale());
        var dcy = (height / 2 - d.y * zoom.scale());
        zoom.translate([dcx, dcy]);
        svg.attr('transform', 'translate(' + dcx + ',' + dcy + ')scale(' + zoom.scale() + ')');
      })
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
        if (d.issuer === 0) {
          /* if issuer */
          if (d.red_flags.total) {
            if (d.red_flags.total >= 4) {
              /* matches all red flags */
              return '/img/red_person.png';
            } else if (d.red_flags.total > 2) {
              return '/img/orange_person.png';
            } else if (d.red_flags.total > 1) {
              return '/img/yellow_person.png';
            } else {
              return '/img/green_person.png';
            }
          } else {
            /* matches none */
            return '/img/green_person.png';
          }
        } else {
          if (d.red_flags.total) {
            if (d.red_flags.total >= 4) {
              return '/img/red_building.png';
            } else if (d.red_flags.total > 2) {
              return '/img/orange_building.png';
            } else if (d.red_flags.total > 1) {
              return '/img/yellow_building.png';
            } else {
              return '/img/green_building.png';
            }
          } else {
            return '/img/green_building.png';
          }
        }
      }
    }

    function zoomed () {
      var trans = d3.event.translate;
      var scale = d3.event.scale;
      svg.attr('transform', 'translate(' + trans + ') scale(' + scale + ')');
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

  fetch: function (params) {
    return new Ember.RSVP.Promise(function (resolve) {
      Ember.$.ajax({
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        url: '/network',
        data: JSON.stringify(params),
        success: function (data) {
          data.edges.forEach(function (edge) {
            return _.map(data.nodes, function (node) {
              if (node.id === edge.ownerCik) {
                edge['node'] = node;
                return edge;
              }
            });
          });
          resolve(data);
        },
        error: function (e) {
          console.error('Error :: ', e);
          resolve([]);
        }
      });
    });
  },

  expandNode: function () {
    var _this = this;
    var cik = this.get('associatesModel.cik');
    var redFlagParams = this.get('redFlagParams');
    var zCik = this.zpad(cik.toString());
    this.set('isLoading', true);
    this.fetch({'cik': zCik, 'redFlagParams': redFlagParams.get_toggled_params()}).then(function (data) {
      _this.set('associatesModel.rgraph', data.edges);
      _this.updateData(data.edges);
      _this.draw(data.edges, Ember.$('.network-graph').innerWidth(), Ember.$('.network-graph').innerHeight());
    });
    this.set('isLoading', false);
  }.observes('associatesModel'),

  updateData: function (rgraph) {
    var rGraphEdges = _.map(rgraph, function (edges) {
      return {'data': edges};
    });
    this.set('rGraphEdges', rGraphEdges);
  },

  toggleTerminalData: function () {
    var n;
    if (this.get('terminalToggle')) {
      var m = JSON.parse(JSON.stringify(this.get('associatesModel').rgraph));
      n = _.filter(m, function (d) {
        return !d.node.data.terminal;
      });
      n = n.length < 1 ? this.get('associatesModel').rgraph : n;
    } else {
      n = this.get('associatesModel').rgraph;
    }

    this.draw(n, Ember.$('.network-graph').innerWidth(), Ember.$('.network-graph').innerHeight());
  },

  actions: {
    toggleTerminal: function () {
      this.set('terminalToggle', !this.terminalToggle);
      this.toggleTerminalData();
    }
  }
});

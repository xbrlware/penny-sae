// web/js/app/network.js

/* global App, Ember, gconfig, $jit, _, implementIcons */

App.NetController = Ember.Controller.extend({
  isLoading: true,
  noData: false
});

App.NetView = Ember.View.extend({
  willInsertElement: function () { implementIcons(); },
  didInsertElement: function () { this.draw(); },
  controllerChanged: function () { this.draw(); }.observes('controller.model'),
  draw: function () {
    var con = this.get('controller');
    
    con.set('hide_terminal', gconfig.DEFAULT_HIDE_TERMINAL)
    
    var cik = con.get('content.cik');
    var redFlagParams = con.get('redFlagParams');
    
    var rgraph = App.RGraph.init(con, 'main-infovis', redFlagParams);
    App.NetworkAPI.expand_node(con, rgraph, cik, redFlagParams, true);
    con.set('rgraph', rgraph);
  }
});

function zpad (x, n) {
  n = n | 10;
  if (x.length < n) {
    return zpad('0' + x, n);
  } else {
    return x;
  }
}

App.NetworkAPI = Ember.Object.extend({});

App.NetworkAPI.reopenClass({
  _fetch: function (params, cb) {
    Ember.$.ajax({
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      url: 'network',
      data: JSON.stringify(params),
      success: cb
    });
  },

  // What if there's a twoway connection
  _add_edges: function (rgraph, edges) {
    _.map(edges, function (edge) {
      rgraph.graph.addAdjacence({'id': edge['ownerCik']}, {'id': edge['issuerCik']}, edge);
    });
  },

  _add_nodes: function (rgraph, nodes) {
    _.map(nodes, function (node) {
      if (!rgraph.graph.hasNode(node)) {
        rgraph.graph.addNode(node, {'redFlags': node.redFlags});
      }
    });
  },

  expand_node: function (con, rgraph, cik, redFlagParams, init) {
    cik = zpad(cik.toString());
    App.NetworkAPI._fetch({'cik': cik, 'redFlagParams': redFlagParams.get_toggled_params()}, function (data) {
      if (init) {
        rgraph.loadJSON(data.nodes);
      } else {
        App.NetworkAPI._add_nodes(rgraph, data.nodes);
      }
      App.NetworkAPI._add_edges(rgraph, data.edges);

      // Add edges for table
      con.update_data(rgraph);

      rgraph.refresh();
    });
  }
});

App.RGraph = Ember.Object.extend();

App.RGraph.reopenClass({
  init: function (con, into, redFlagParams) {
    var rgraph = new $jit.RGraph({
      injectInto: into,

      // Transitions
      duration: 1000,
      interpolation: 'linear',
      background: {
        CanvasStyles: {
          strokeStyle: '#333'
        }
      },
      Navigation: {
        enable: true,
        panning: 'avoid nodes',
        zooming: 10
      },
      Node: {
        type: 'image',
        dim: 5,
        overridable: true
      },
      Tips: {
        enable: true,
        type: 'Native',
        offsetX: 10,
        offsetY: 10,
        onShow: function (tip, node) {
          tip.innerHTML = `Name: ${node.name} <br> CIK: ${node.id}`;
        }
      },
      Edge: {
        overridable: true,
        color: gconfig.NETWORK_EDGE_COLOR,
        lineWidth: gconfig.NETWORK_EDGE_WIDTH,
        alpha: 0.9
      },
      Events: {
        enable: true,
        type: 'Native',
        onDragMove: function (node, eventInfo, e) {
          if (node) {
            var pos = eventInfo.getPos();
            node.pos.setc(pos.x, pos.y);
            rgraph.plot();
          }
        },
        onDragStart: function (node, eventInfo, e) {
          if (node) {
            node.setData('dim', gconfig.DRAG_NODE_SIZE);
            rgraph.plot();
          }
        },
        onDragEnd: function (node, eventInfo, e) {
          if (node) {
            node.setData('dim', gconfig.STANDARD_NODE_SIZE);
            rgraph.plot();
          }
        },
        onClick: function (node, eventInfo, e) {
          if (node) {
            node.setData('dim', gconfig.STANDARD_NODE_SIZE);
            App.NetworkAPI.expand_node(con, rgraph, node.id, redFlagParams, false);
          }
        },
        onRightClick: function (node, eventInfo, e) {
          if (node) {
            console.log('node on rightclick', node);
          }
        }
      },
      onPlaceLabel: function (domElement, node) {
        var style = domElement.style;
        domElement.innerHTML = node.name;

        style.display = '';
        style.cursor = 'move';
        style['user-select'] = 'none';
        style['-webkit-user-select'] = 'none';
        style['-moz-user-select'] = 'none';

        if (node._depth <= 1) {
          style.fontSize = '0.9em';
          style.color = '#FFFFFF';
          style.textShadow = '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black';
        } else if (node._depth === 2 || node._depth === 3) {
          style.fontSize = '0.7em';
          style.color = '#FFFFFF';
        } else {
          style.fontSize = '0.3em';
          style.color = '#494949';
        }

        var left = parseInt(style.left);
        var w = domElement.offsetWidth;
        style.left = (left - (w / 2)) + 'px';
      },
      onBeforePlotNode: function (node) {
        // Resize node
        if (node.data['$dim'] !== gconfig.DRAG_NODE_SIZE) {
          node.data['$dim'] = gconfig.STANDARD_NODE_SIZE;
        }
        
        if (con.get('hide_terminal') && node.data['terminal']) {
          node.data['$alpha'] = 0
        }

        node.data['$color'] = App.RGraph.computeColor(node.data['redFlags']['total']);
      }
    });
    App.RGraph.addButtons(con, rgraph)
    return rgraph;
  },

   addButtons: function (con, rgraph) {
     button = $jit.id('toggle-terminal')
     button.onclick = function () {
       con.toggleProperty('hide_terminal')
      
       $(this).context.value = (con.get('hide_terminal') ? 'Show' : 'Hide') + ' Terminal Nodes'
       rgraph.graph.eachNode(function (node) {
         node.setData('alpha', con.get('hide_terminal') ? (node.data['terminal'] ? 0 : 1) : 1, 'end')
       })
      
       rgraph.fx.animate({
         modes: ['node-property:alpha'],
         duration: 250
       })
     }
   },

  computeColor: function (redFlagsTotal) {
    if (redFlagsTotal === undefined) { return 'grey'; }

    if (redFlagsTotal < 1) {
      return 'green';
    } else if (redFlagsTotal >= 1 & redFlagsTotal < 2) {
      return 'yellow';
    } else if (redFlagsTotal >= 2 & redFlagsTotal < 4) {
      return 'orange';
    } else if (redFlagsTotal >= 4) {
      return 'red';
    }
  }
});

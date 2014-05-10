// -------------------------------------------------------------
// ------------------ Network Visualization --------------------
// -------------------------------------------------------------

var ht = false; // "Hide terminal nodes" -- implementation is ugly and should be fixed (by someone who understands Ember better)
function initElastic(center, neighbors){
    var network = [];
    var neibs   = neighbors.hits.hits;
    var ths     = center.hits.hits[0]._source;

    // Add central terminal
    ths.data.explored = true;
    ths.data.first    = true;
    ths.data.hidden   = 0;
    ths.data.depth    = 0;
    network.push(ths);

    for(i = 0; i < neibs.length; i++){
        var src = neibs[i]._source;
        var new_adjacencies = [];
        var unconn = 0;
        src.adjacencies.forEach(function(a){
            var found_new = neibs.findBy('_source.id', a.nodeTo) == undefined ? false : true;
            var found_old = network.findBy('id', a.nodeTo) == undefined ? false : true;
            if(found_new || found_old) {
                new_adjacencies.push(a);
            } else {
                unconn++;
            }
        });
        src.adjacencies = new_adjacencies;
        if(src.adjacencies.length <= 1) {
            src.data['explored'] = true;
        }
        
        src.data['hidden'] = unconn;
        if(unconn == 0) {
            src.data['explored'] = true;
        } else {
            src.data['explored'] = false;
        }
        src.data['depth'] = 1;
        network.push(src);
    }
    
    return network;
}

function miniRGraph(into) {
    var rgraph = new $jit.RGraph({
        injectInto: into,
        background: {
          CanvasStyles: {
            strokeStyle: '#333'
          }
        },
        Node: {
            type  : 'image',
            color : '#867970',
            dim   : 5,
            overridable : true
        },
        Edge: {
            color     : NETWORK_EDGE_COLOR,
            lineWidth : NETWORK_EDGE_WIDTH,
            alpha     : .9
        },
        onBeforePlotNode: function(node) {
            if(node.data['terminal']){
                node.data['$color'] = "#FF00FF"
                node.data['$dim'] = 2;
            } else {
                node.data['$dim'] = 3 + 2 * Math.log(1 + node.data['hidden']);
            }

            if(ht && node.data['terminal']){
                node.data["$alpha"] = 0;
            }
            
            // Companies
            if(node.data.have_data) {
                var risk = node.data.risk.risk_quant;
            } else {
                var risk = node.data.ex_risk.ex_risk_quant; // Fix this scaling issue
            }
            
            
            if(risk < LOW_RISK_THRESH) {
                node.data["$color"] = "green";
            } else if (risk >= LOW_RISK_THRESH && risk <= HIGH_RISK_THRESH){
                node.data["$color"] = "yellow";
            } else if (risk > HIGH_RISK_THRESH){
                node.data["$color"] = "red";
            } else {
                node.data["$color"] = "grey";
            }
            
            if(node.data["first"]){
                node.data["$dim"] = 5;
            }
        }
    });
    rgraph.canvas.scale(.9, .9)
    return rgraph;
}
// ----------------------------------------
// -------Front Page Network Viz-----------
// ----------------------------------------

App.MininetworkView = Ember.View.extend({
    templateName: "mininetwork",
    render: function(buffer){
        buffer.push('<center>')
            buffer.push('<div class="mini-center-container">');
                buffer.push('<div class="mini-infovis" id="mini-infovis-' + this.get('cik') + '"></div>');
            buffer.push('</div>');
        buffer.push('<center>');
    },
    willInsertElement: function() {
        implementIcons();
    },
    didInsertElement: function() {
        this.makeMininetworkView();
    },
    makeMininetworkView : function() {
        that = this
        var cik = this.get('cik');
        
        return fetch_companies({
            index      : 'network',
            query_type : 'networkQuery_center',
            query_args : [cik],
            callback   : function(center) {
                if(center.hits.hits.length > 0){
                    fetch_companies({
                        index : 'network',
                        query_type : 'networkQuery_neighbors',
                        query_args : [center.hits.hits[0]._source.adjacencies],
                        callback : function(neighbors) {
                            var json   = initElastic(center, neighbors, []);
                            var rgraph = miniRGraph('mini-infovis-' + cik);
                            rgraph.loadJSON(json);
                            rgraph.refresh();
                        }
                    });
                };
            }
        });
    }
});





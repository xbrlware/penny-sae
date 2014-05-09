// -------------------------------------------------------------
// ------------------ Network Visualization --------------------
// -------------------------------------------------------------


function networkInfo(node) {
    console.log('networkInfo', node);
    str = ''

    if(node.data.otc == false){

        str +='<center><div class="container"><div class="row">'
        content = '<h4>' + node.name + '</h4>'
        content += '<h5>Risk Score: ' + node.data.ex_risk.ex_risk_quant + '</h5>'
        content += '<b>SEC ID (CIK): ' + node.id + ', Owner</b>'
        str += '<div class="col-md-9 col-lg-9">\<div class="dummy20"></div><a class="thumbnail">' + content +
                '</a></div></div>' +
                '<div class="col-md-9">'

        var adj = node.adjacencies;
        return new Ember.RSVP.Promise(function(resolve, reject) {
            fetch_companies({
                query_type : 'currentQuery',
                query_args : [Object.keys(adj)],
                index      : 'companies_current',
                callback   : function(data) {
                    var hits = data.hits.hits;
                    if(hits.length > 0){
                        $.each(adj, function(key, value) {
                                var info = hits.findBy('_id', parseInt(key).toString());
                                console.log('info', info);
                               
                                content = '<div class="list-group pane">'
                               
                                    content += '<div class="list-group-item"><div class="list-group-item-heading">Date</div>'
                                    content += '<div class="list-group-item-text">' + value.data.date + '</div></div>'

                                    content += '<div class="list-group-item"><div class="list-group-item-heading pane">Relationship</div>'
                                    content += '<div class="list-group-item-text">' + value.data.relationship + '</div></div>'

                                    content += '<div class="list-group-item"><div class="list-group-item-heading pane">Company Name</div>'
                                    content += '<div class="list-group-item-text">' + info._source.company_name + '</div></div>'

                                    content += '<div class="list-group-item"><div class="list-group-item-heading pane">Company SEC ID (SIC)</div>'
                                    content += '<div class="list-group-item-text">' + info._source.sic + '</div></div>'

                                    content += '<div class="list-group-item"><div class="list-group-item-heading pane">Company State of Incorporation</div>'
                                    content += '<div class="list-group-item-text">' + info._source.state_of_incorporation + '</div></div>'
                               
                                content += '</div>'

                                var cik = parseInt(info._source.cik);
                                console.log(cik);
                                str += '<div class="col-lg-6 col-md-6">\
                                        <div class="dummy100"></div>\
                                        <a class="thumbnail" href="index.html#/detail/' + cik + '">' + content + '</a>\
                                      </div>'
                        });
                        str += '</div></div></center>'
                    };
                    resolve(str);
                }
            });
        });
    } else {
        var id = node.id;
        console.log(adj);

        return new Ember.RSVP.Promise(function(resolve, reject) {
            fetch_companies({
                data       : 'currentQuery',
                query_args : [id],
                index      : 'companies_current',
                callback   : function(data) {
                    var hit = data.hits.hits;
                    console.log('node', node)
                    if(hit.length > 0){
                        var sic   = hit[0]._source.sic;
                        var state = hit[0]._source.state_of_incorporation;
                        var risk_quant = node.data.risk.risk_quant;

                        content = '<h4>' + node.name + '</h4>'
                        content += '<h5>Risk Score: ' + risk_quant + '</h5>'
                        content += '<b> SEC ID (CIK): ' + node.id + ', Security</b>'
                        content += '<p>'
                        if(sic != undefined)
                            content += sic + '<br>'
                        if(state != undefined)
                            content += state
                        content += '</p>'
                        
                        var cik = parseInt(node.id);
                        console.log(cik);
                        if(content != '') {
                            str +='<div class="container"><div class="row">\
                                    <div class="col-md-9 col-lg-9">\ <div class="dummy25"></div>\
                                    <a class="thumbnail" href="index.html#/detail/' + cik + '">' + content + '</a></div>'
                        }
                    }
                    
                    resolve(str);
                }
            })
        })
    }
}


var ht = false; // "Hide terminal nodes" -- implementation is ugly and should be fixed (by someone who understands Ember better)
App.NetView = Ember.View.extend({
    didInsertElement: function() {
        this.initRGraph(this, true);
    },
    controllerChanged: function() {
        console.log('reloading...');
        this.initRGraph(this, false);
    }.observes('controller.model'),
    initRGraph: function(that, is_new) {
        $jit.id('inner-details').innerHTML = "";
        console.log(that);
        var con = that.get('controller');
        console.log('con', con);
        
        return fetch_companies({
            index      : 'network',
            query_type : 'networkQuery_center',
            query_args : [that.data.get('content').cik],
            callback   : function(center) {
                if(center.hits.hits.length > 0){
                    fetch_companies({
                        index      : 'network',
                        query_type : 'networkQuery_neighbors',
                        query_args : [center.hits.hits[0]._source.adjacencies],
                        callback : function(neighbors) {
                            var json   = initElastic(center, neighbors, []);
                            if(is_new == true) {
                                var rgraph = makeRGraph(con, 'main-infovis');
                            } else {
                                var rgraph = con.get('rgraph_object');
                                console.log('rgraph', rgraph)
                            }
                            rgraph.loadJSON(json);
                            rgraph.refresh();
                            
                            con.set('vis_center', center.hits.hits[0]._id);
                            con.send('setRgraph', rgraph.toJSON('graph'));
                            con.set('rgraph_object', rgraph);
                            
                            button = $jit.id('toggle-terminal');
                            button.onclick = function(){
                                if(ht == false){
                                    con.set('ht', true);
                                    ht = true;
                                    rgraph.graph.eachNode(function(node){
                                        if(node.data['terminal'] == true)
                                            node.setData("alpha", 0, "end");
                                    });
                                    rgraph.fx.animate({
                                        modes: ['node-property:alpha'],
                                        duration: 250
                                    });
                                } else {
                                    con.set('ht', false);
                                    ht = false;
                                    rgraph.graph.eachNode( function(node){
                                            node.setData("alpha", 1, "end");
                                    });
                                    rgraph.fx.animate({
                                        modes: ['node-property:alpha'],
                                        duration: 250
                                    });
                                }
                            };
                        }
                    });
                };
            }
        });
    }
});

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

// Doesn't work perfectly, but it's getting pretty close...
function updateElastic(center, neighbors, center_node, rgraph){
    center_node.data['explored'] = true;
    center_node.data['hidden']   = 0;
    var neibs = neighbors.hits.hits;
    
    for(i = 0; i < neibs.length; i++){
        var src = neibs[i]._source;
        
        var n = rgraph.graph.getNode(src.id);
        if(n == undefined) {
            rgraph.graph.addNode(src);
            n = rgraph.graph.getNode(src.id);
            n.data['explored'] = false;
            n.data['depth']    = 999;
        }
        
        var unconn = 0;
        src.adjacencies.forEach(function(a){
            var to = rgraph.graph.getNode(a.nodeTo)
            if(to != undefined) {
                n.data['depth'] = to.data['depth'] < n.data['depth'] ? to.data['depth'] + 1 : n.data['depth'];
                rgraph.graph.addAdjacence(n, to, data = a.data);
            } else {
                unconn++;
            }
        });
            
        if(src.adjacencies.length <= 1) {
            n.data['explored'] = true;
        }
        
        n.data['hidden'] = unconn;
        if(unconn == 0) {
            n.data['explored'] = true;
        } else {
            n.data['explored'] = false;
        }
    }
    console.log(rgraph.graph);
}

function trimGraph(center_node, rgraph) {
    center_node.data['devisited'] = true;
    center_node.data['explored']  = false;
    center_node.eachAdjacency(function(adj){
        if(Object.keys(adj.nodeTo.adjacencies).length == 1){
            console.log('removing', adj.nodeTo);
            rgraph.graph.removeAdjacence(adj.nodeFrom.id, adj.nodeTo.id);
            rgraph.op.removeNode(adj.nodeTo.id, {
                type     : 'fade:con',
                duration : 1500
            });
        };
    });
};

function makeRGraph(con, into) {
    var rgraph = new $jit.RGraph({
        injectInto: into,
        background: {
          CanvasStyles: {
            strokeStyle: '#333'
          }
        },
        Navigation: {
            enable  : true,
            panning : true,
            zooming : 10
        },
        Node: {
            type        : 'circle',
            color       : '#867970',
            dim         : 3,
            overridable : true
        },
        Edge: {
            color     : NETWORK_EDGE_COLOR,
            lineWidth : NETWORK_EDGE_WIDTH,
            alpha     : .9
        },
        duration: 1000,
        interpolation: 'linear',
        onCreateLabel: function(domElement, node){
            domElement.innerHTML = node.name;
            domElement.onclick = function(){
                if(con.get('vis_center') == node.id){
                    trimGraph(node, rgraph);
                    rgraph.onClick(node.id);
                    con.send('setRgraph', rgraph.toJSON('graph'));
                } else {
                    con.set('vis_center', node.id);
                    console.log('about to call fetch ')
                    return fetch_companies({
                        index      : 'network',
                        query_type : 'networkQuery_center',
                        query_args : [node.id],
                        callback   : function(center) {
                            if(center.hits.hits.length > 0){
                                fetch_companies({
                                    index : 'network',
                                    query_type : 'networkQuery_neighbors',
                                    query_args : [center.hits.hits[0]._source.adjacencies],
                                    callback : function(neighbors) {
                                        console.log('calling second callback');
                                        updateElastic(center, neighbors, node, rgraph);
                                        rgraph.onClick(node.id);
                                        con.send('setRgraph', rgraph.toJSON('graph'));
                                    }
                                });
                            };
                        }
                    });
                };
            };
        },
        //Change some label dom properties.
        //This method is called each time a label is plotted.
        onPlaceLabel: function(domElement, node){
//            console.log('calling onPlaceLavel')
            var style = domElement.style;
            style.display = '';
            style.cursor = 'pointer';

            if (node._depth <= 1) {
                style.fontSize = "0.7em";
                style.color = "#FFFFFF";
                style.textShadow = "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black";
            } else if(node._depth == 2 || node._depth == 3){
                style.fontSize = "0.5em";
                style.color = "#FFFFFF";
            } else {
                style.fontSize = "0.2em";
                style.color = "#494949";
            }

            var left = parseInt(style.left);
            var w    = domElement.offsetWidth;
            style.left = (left - (w / 2)) + 'px';
            
        },
        onBeforePlotNode: function(node) {
            if(node.data['terminal']){
                node.data['$dim'] = 1.5;

            } else {
                node.data['$dim'] = 3 + 2 * Math.log(1 + node.data['hidden']);
                if(node.data['devisited']){
                    node.data['$type'] = 'square';
                } else {
                    if(node.data['explored']){
                        node.data['$type'] = 'triangle';
                    }
                }
            }

            if(ht && node.data['terminal'])
                node.data["$alpha"] = 0;
            
            // Companies
            if(node.data.have_data == true) {
                node.data['$type'] = "circle"
                var risk = node.data.risk.risk_quant;
            } else {
                node.data['$type'] = "square"
                var risk = node.data.ex_risk.ex_risk_quant; // Fix this scaling issue
            }
            
            if(risk < LOW_RISK_THRESH) {
                node.data["$color"] = "green"
            } else if (risk >= LOW_RISK_THRESH && risk <= HIGH_RISK_THRESH){
                node.data["$color"] = "yellow"
            } else if (risk > HIGH_RISK_THRESH){
                node.data["$color"] = "red"
            } else {
                node.data["$color"] = "orange"
            }
            
            
            if(node.data["first"])
                node.data['$type'] = "star"
        },
        onBeforeCompute: function(node) {
            var inf = networkInfo(node);
            inf.then(function(html) {
                $jit.id('inner-details').innerHTML = html;
            })
        }
    });
    return rgraph;
}

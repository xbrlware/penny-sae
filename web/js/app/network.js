// Ownership Network Visualization 
// Aesthetics for network visualization

//
function create_network_associates(network_center, network_associates) {
    if(network_associates.length > 0) {
        return _.chain(network_associates).filter(function(x) {return x.id}).map(function(x) {
            var adj = network_center._source.adjacencies.findBy('nodeTo', x.id);
            
            // If extracted via NER
            if(x.data.ner) {
                x.data.type         = 'entity';
                x.data.relationship = '';
                
                if(adj == undefined || adj.data == undefined || adj.data.hidden == undefined) {
                    // Defaults to hidden
                    x.hidden = true;
                } else {
                    x.hidden = adj.data.hidden;
                }
                
            } else {
                x.data.relationship = adj.data.relationship;
                if(adj.data.hidden == undefined) {
                    // Defaults to shown
                    x.hidden = false;
                } else {
                    x.hidden = adj.data.hidden;
                }
                
            }
            
            // If augmented, add source
            if(adj.data.aug) {
                x.augmented   = true;
                x.data.source = "augmented";
            } else {
                x.augmented = false;
                if(x.data.ner) {
                    x.data.source = 'NER';
                } else {
                    x.data.source = "Form 4";
                }
            }
                        
            return Ember.Object.create(x)
            
        }).value();
    } else {
        return [];
    }
}

function add_node(con, action, cik, rf_clean, that, node, rgraph) {
    return fetch_companies({
        index      : config.NETWORK_INDEX,
        query_type : 'networkQuery_center',
        query_args : { "cik" : cik },
        rf         : rf_clean,
        callback   : function(center) {
            if(center.hits.total > 0){
                
                var network_center = center.hits.hits.findBy('_index', config.NETWORK_INDEX);
                var orig_adj       = network_center._source.adjacencies;
                
                if(network_center != undefined) {
                    if(action == 'initial') {
                        con.set('isLoading', true)
                    }
                    
                    network_center.companies = center.hits.hits.findBy('_index', config.COMPANY_INDEX);

                    fetch_companies({
                        index : config.NETWORK_INDEX,
                        query_type : 'networkQuery_neighbors',
                        query_args : {"adj" : network_center._source.adjacencies},
                        rf         : rf_clean,
                        callback : function(neighbors) {
                            var network_associates = create_network_associates(
                                network_center,
                                _.sortBy(
                                    _.pluck(
                                        _.filter(neighbors.hits.hits, function(hit) {
                                            return hit._index != config.COMPANY_INDEX
                                        }),
                                        '_source'
                                    ),
                                    'id'
                                )
                            );
                            
                            if(action == 'initial') {
                                con.set('orig_network_associates', network_associates);
                                con.set('network_associates', network_associates);
                            };
                            
                            companies = _.filter(neighbors.hits.hits, function(hit) {
                                return hit._index == config.COMPANY_INDEX
                            });
                            network_neighbors = _.filter(neighbors.hits.hits, function(hit) {
                                return hit._index == config.NETWORK_INDEX
                            });
                            _.map(network_neighbors, function(neighbor) {
                                neighbor.companies = companies.findBy('_id', neighbor._id);
                            });

                            // Find neighbors that are either not NER or not hidden
                            var sub_network_neighbors = _.filter(network_neighbors, function(neighbor) {
                                // Get node data from edge...
                                var equiv = _.filter(network_associates, function(x){
                                    return x.id == neighbor._id || smart_parseInt(x.id) == neighbor._id
                                })[0];
                                
                                if(equiv.name == undefined) {
                                    return false;
                                } else if(equiv == undefined) {
                                    return false;
                                } else {
                                    return !equiv.hidden || false;
                                }
                            });

                            if(action == 'update') {
                                updateElastic(
                                    sub_network_neighbors,
                                    network_center,
                                    node,
                                    rgraph,
                                    rf_clean,
                                    function(rgraph) {
                                        rgraph.onClick(node.id);
                                        con.set('rgraph_json', rgraph.toJSON('graph'));
                                    }
                                );
                            } else if(action == 'initial') {
                                if(sub_network_neighbors.length > 0) {
                                    initElasticBig(
                                        network_center,
                                        sub_network_neighbors,
                                        rf_clean,
                                        function(json) {
                                            var rgraph = makeRGraph(con, 'main-infovis', rf_clean);
                                            rgraph.loadJSON(json);
                                            rgraph.refresh();
                                        
                                            con.set('rgraph_origin', network_center);
                                            con.set('orig_adj', orig_adj);

                                            con.set('rgraph_json',   rgraph.toJSON('graph'));
                                            con.set('rgraph_object', rgraph);

                                            that.addButton(con, rgraph);
                                            con.set('isLoading', false);

                                            // Hackily hide augmented nodes
                                            function getAlpha(node, hide_terminal, hide_ner) {
                                                if(hide_terminal && node.data['terminal']) {
                                                    return 0;
                                                } else if(hide_ner && node.data['ner']) {
                                                    return 0;
                                                } else {
                                                    return 1;
                                                }
                                            }
                                            rgraph.graph.eachNode( function(node){
                                                node.setData("alpha", getAlpha(node, con.get('hide_terminal'), con.get('hide_ner')), "end")
                                            });
                                            rgraph.fx.animate({
                                                modes    : ['node-property:alpha'],
                                                duration : 0
                                            });
                                            
                                        }
                                    );
                                } else {
                                    con.set('noData', true);
                                    con.set('isLoading', false);
                                }
                            }
                        }
                    });
                };
            } else {
                con.set('noData', true);
            }
        }
    });
};

function red_flag_individuals(args) {
    Ember.$.ajax({
        type        : "POST",
        contentType : "application/json",
        dataType    : "json",
        url         : "red_flag_individuals",
        data : JSON.stringify({
            "query_args" : args.query_args,
            "rf"         : args.rf
        }),
        success : args.callback,
        error   : function (xhr, status, error) {
            console.log('Error: ' + error.message);
        }
    });
};


function networkInfo(node) {
    str = ''
    if(node.data.type != 'issuer'){
        str     +='<center><div class="container"><div class="row">'
        content  = '<h4>' + node.name + '</h4>'
        content += '<b>SEC ID (CIK): ' + node.id + '</b>'
        str     += '<div class="col-md-9 col-lg-9">\<div class="dummy20"></div><a class="thumbnail">' + content +
                    '</a></div></div><div class="col-md-9">'

        var adj = node.adjacencies;
        return new Ember.RSVP.Promise(function(resolve, reject) {
            fetch_companies({
                query_type : 'currentQuery',
                query_args : {"id" : Object.keys(adj)},
                rf         : undefined,
                index      : 'companies_current',
                callback   : function(data) {
                    var hits = data.hits.hits;
                    if(hits.length > 0){
                        $.each(adj, function(key, value) {
                                var info = hits.findBy('_id', parseInt(key, 10).toString());
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
                                str += '<div class="col-lg-6 col-md-6">\
                                        <div class="dummy100"></div>\
                                        <a class="thumbnail" href="index.html#/o/detail/' + cik + '">' + content + '</a>\
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
        return new Ember.RSVP.Promise(function(resolve, reject) {
            fetch_companies({
                data       : 'currentQuery',
                query_args : {"id" : id},
                rf         : undefined,
                index      : 'companies_current',
                callback   : function(data) {
                    var hit = data.hits.hits;
                    if(hit.length > 0){
                        var sic   = hit[0]._source.sic;
                        var state = hit[0]._source.state_of_incorporation;
                        
                        content = '<h4>' + node.name + '</h4>'
                        content += '<b> SEC ID (CIK): ' + node.id + ', Security</b>'
                        content += '<p>'
                        if(sic != undefined)
                            content += sic + '<br>'
                        if(state != undefined)
                            content += state
                        content += '</p>'
                        
                        var cik = parseInt(node.id);
                        if(content != '') {
                            str +='<div class="container"> \
                                        <div class="row"> \
                                            <div class="col-sm-9"> \
                                                <div class="dummy25"></div> \
                                                <a class="thumbnail" href="index.html#/o/detail/' + cik + '">' + content + '</a>\
                                            </div>\
                                        </div>\
                                    </div>'
                        }
                    }
                    
                    resolve(str);
                }
            })
        })
    }
};

App.NetController = Ember.ObjectController.extend({
    isLoading : true,
    noData    : false
});

App.NetView = Ember.View.extend({
    // Load icons
    willInsertElement : function() {
        implementIcons();
    },
    
    didInsertElement: function() {
        this.initRGraph(this, true);
    },
    
    controllerChanged: function() {
        this.initRGraph(this, true);
    }.observes('controller.model'),
        
    initRGraph: function(that) {
        this.get('controller').set('hide_terminal', gconfig.DEFAULT_HIDE_TERMINAL);
        this.get('controller').set('hide_ner', gconfig.DEFAULT_HIDE_NER);


        $jit.id('inner-details').innerHTML = "";

        var con = that.get('controller');
        var rf  = con.get('rf');
        
        con.set('noData', false);

        /* rf_clean isn't working for some reason... swap this later */
        if(rf != undefined){
            exists = new Object;
            Object.keys(rf).map(function(key) {
                if(key != "exists" && key != "toggles"){
                    exists[key] = false;
                    if(rf[key] != undefined){
                        Object.keys(rf[key]).map(function(inner_key) {
                            if(rf[key][inner_key] != undefined)
                                exists[key] = true;
                        });
                    }
                }
            });
            
            rf.exists  = exists;
            rf.toggles = {
                'delta'         : true,
                'network'       : true,
                'financials'    : true,
                'trading_halts' : true,
                'delinquency'   : true
            }
        };
        var rf_clean = rf;
        
        return add_node(con, 'initial', that.data.get('content').cik, rf_clean, that, undefined, undefined)
    },
    
    addButton: function(con, rgraph) {
        function getAlpha(node, hide_terminal, hide_ner) {
            if(hide_terminal && node.data['terminal']) {
                return 0;
            } else if(hide_ner && node.data['ner']) {
                return 0;
            } else {
                return 1;
            }
        }

        button = $jit.id('toggle-terminal');
        button.onclick = function(){
            con.toggleProperty('hide_terminal');
            if(con.get('hide_terminal')) {
                $(this).context.value = "Show Terminal Nodes";
            } else {
                $(this).context.value = "Hide Terminal Nodes";
            }
            rgraph.graph.eachNode(function(node){
                node.setData("alpha", getAlpha(node, con.get('hide_terminal'), con.get('hide_ner')), "end");
            });
            rgraph.fx.animate({
                modes: ['node-property:alpha'],
                duration: 250
            });
        };
                
        ner_button = $jit.id('toggle-ner');
        ner_button.onclick = function() {
            con.toggleProperty('hide_ner');
            if(con.get('hide_ner')) {
                $(this).context.value = "Show Augmented Network";
            } else {
                $(this).context.value = "Hide Augmented Network";
            }
            rgraph.graph.eachNode( function(node){
                node.setData("alpha", getAlpha(node, con.get('hide_terminal'), con.get('hide_ner')), "end")
            });
            rgraph.fx.animate({
                modes: ['node-property:alpha'],
                duration: 250
            });
        }
    }
});


function smart_parseInt(x) {
    var x_asint = parseInt(x, 10);
    if(!isNaN(x_asint)) {
        return x_asint
    } else {
        return x
    }
};


function initElasticBig(network_center, neibs, rf_clean, callback){
    // Prevent unselected named entities from plotting
    network_center._source.adjacencies = _.filter(network_center._source.adjacencies, function(adj) {
        return _.where(neibs, {"_id" : smart_parseInt(adj.nodeTo) + ''}).length > 0;
    });

    var network = [];
    var ths     = network_center._source;
    
    if(network_center.companies != undefined) {
        var crf = set_red_flags(rf_clean, network_center.companies.fields);
        ths.data.totalRedFlags = crf.total;
    }
    
    // Add central node
    ths.data.first        = true;
    ths.data.invisible    = 0;
    ths.data.depth        = 0;
    ths.data.relationship = 'Center'
    network.push(ths);
    
    var all_ciks = _.uniq(_.pluck(neibs, '_id'));
    red_flag_individuals({
        query_args : {"all_ciks" : all_ciks},
        rf         : rf_clean,
        callback   : function(company_data) {
            fetch_companies({
                index      : config.NETWORK_INDEX,
                query_type : 'networkQuery_adjacencies',
                query_args : {"all_ciks" : all_ciks},
                rf         : rf_clean,
                callback: function(adj_response) {
                
                    var adjs = _.filter(adj_response.hits.hits, function(x) {
                        return x._index == config.NETWORK_INDEX;
                    });
                    _.map(neibs, function(neib) {
                        var adj_match = adjs.findBy('_id', neib._id);
                        neib._source.adjacencies = adj_match._source.adjacencies;
                    });
                    
                    $.each(neibs, function(index, n) {
                        // Find neighbor in network adjacencies
                        var src = JSON.parse(JSON.stringify(n._source));
                        var edge = network_center._source.adjacencies.findBy('nodeTo', src.id);
                        
                        // Fix relationship of neighbor
                        relationship = edge.data.relationship;
                        if(relationship != undefined) {
                            src.data['relationship'] = relationship;
                        } else {
                            src.data['relationship'] = 'Unknown'
                        }
                        
                        // Find adjacencies to neighbors
                        var new_adjacencies = [];
                        var unconn = 0;
                        src.adjacencies.forEach(function(a){
                            var found_new = neibs.findBy('_source.id', a.nodeTo) == undefined ? false : true;
                            var found_old = network.findBy('id', a.nodeTo) == undefined ? false : true;
                            if(found_new || found_old){
                                new_adjacencies.push(a);
                            } else {
                                unconn++;
                            }
                        });
                        src.adjacencies = new_adjacencies;
         
                        src.data['depth']     = 1;
                        src.data['invisible'] = unconn;

                        // If node has other neighbors, compute risk score
                        if(n.companies != undefined){
                            var crf = set_red_flags(rf_clean, n.companies.fields);
                            src.data['totalRedFlags'] = crf.total;
                        } else {
                            company_data.map(function(x) {
                                if(x.cik == n._id) {
                                    if(src.id == undefined) {
                                        src.id = x.cik;
                                    }
                                    src.data['totalRedFlags'] = x.avg;
                                }
                            });
                        }
                        network.push(src);
                        if(network.length == (neibs.length + 1)){
                            callback(network);
                        }
                    });
                }
            });
        }
    });
};


function updateElastic(neibs, network_center, center_node, rgraph, rf_clean, callback){

    network_center._source.adjacencies = _.filter(network_center._source.adjacencies, function(adj) {
        return _.where(neibs, {"_id" : smart_parseInt(adj.nodeTo) + ''}).length > 0;
    });

    center_node.data['invisible']   = 0;
    var all_ciks = _.pluck(neibs, '_id');
    red_flag_individuals({
        query_args : {"all_ciks" : all_ciks},
        rf         : rf_clean,
        callback   : function(company_data) {
            console.log('did red flag individuals')
            fetch_companies({
                index      : config.NETWORK_INDEX,
                query_type : 'networkQuery_adjacencies',
                query_args : {"all_ciks" : all_ciks},
                rf         : rf_clean,
                callback: function(adj_response) {
                    console.log('did fetch companies')
                
                    var adjs = _.filter(adj_response.hits.hits, function(x) {
                        return x._index == config.NETWORK_INDEX;
                    });
                    _.map(neibs, function(neib) {
                        var adj_match    = adjs.findBy('_id', neib._id);
                        neib._source.adjacencies = adj_match._source.adjacencies;
                    });

                    counter = 0;
                    $.each(neibs, function(index, nn) {
                        var src = nn._source;
                        
                        var n = rgraph.graph.getNode(src.id);
                        if(n == undefined) {
                            rgraph.graph.addNode(src);
                            n = rgraph.graph.getNode(src.id);
                            n.data['depth'] = 999;
                        
                            if(nn.companies != undefined){
                                counter++
                                var crf = set_red_flags(rf_clean, nn.companies.fields);
                                n.data['totalRedFlags'] = crf.total;
                            } else {
                                counter++
                                company_data.map(function(x) {
                                    if(x.cik == nn._id) {
                                        n.data['totalRedFlags'] = x.avg;
                                    }
                                });
                            }
                        } else {
                            counter++
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
                        n.data['invisible'] = unconn;
                        
                        if(counter == neibs.length) {
                            callback(rgraph);
                        }
                    });
                }
            });
        }
    });
};

function makeRGraph(con, into, rf_clean) {
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
            enable  : true,
            panning: 'avoid nodes',
            zooming : 10
        },
        Node: {
            type        : 'image',
            dim         : 5,
            overridable : true
        },
        Tips: {  
            enable: true,
            type: 'Native',  
            offsetX: 10,  
            offsetY: 10,  
            onShow: function(tip, node) {
                console.log('hovering on ', node);
                tip.innerHTML = node.name;
            }
        },
        Edge: {
            color     : gconfig.NETWORK_EDGE_COLOR,
            lineWidth : gconfig.NETWORK_EDGE_WIDTH,
            alpha     : .9
        },
        Events : {
            enable     : true,
            type       : 'Native',
            onDragMove : function(node, eventInfo, e) {
                if(node) {
                    var pos = eventInfo.getPos();
                    node.pos.setc(pos.x, pos.y);  
                    rgraph.plot();
                }
            },
            onDragStart : function(node, eventInfo, e) {
                if(node) {
                    node.setData('dim', gconfig.DRAG_NODE_SIZE);
                    rgraph.plot();
                }
            },
            onDragEnd : function(node, eventInfo, e) {
                if(node) {
                    node.setData('dim', gconfig.STANDARD_NODE_SIZE);
                    rgraph.plot();
                }
            },
            onClick : function(node, eventInfo, e) {
                if(node) {
                    node.setData('dim', gconfig.STANDARD_NODE_SIZE);
                    add_node(con, 'update', node.id, rf_clean, false, undefined, node, rgraph)
                    rgraph.plot();
                }
            },
            onRightClick : function(node, eventInfo, e) {
                if(node) {
                    console.log('node on rightclick', node);
                }
            }
        },
        onPlaceLabel: function(domElement, node){
            var style = domElement.style;
            domElement.innerHTML = node.name;
            style.display = '';
            style.cursor = 'move';
            style['user-select'] = 'none';
            style['-webkit-user-select'] = 'none';
            style['-moz-user-select'] = 'none';

            if (node._depth <= 1) {
                style.fontSize   = "0.9em";
                style.color      = "#FFFFFF";
                style.textShadow = "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black";
            } else if(node._depth == 2 || node._depth == 3){
                style.fontSize = "0.7em";
                style.color    = "#FFFFFF";
            } else {
                style.fontSize = "0.3em";
                style.color    = "#494949";
            }

            var left = parseInt(style.left);
            var w    = domElement.offsetWidth;
            style.left = (left - (w / 2)) + 'px';
            
        },
        onBeforePlotNode: function(node) {
            
            // Resize node
            if(node.data["$dim"] != gconfig.DRAG_NODE_SIZE)
                node.data["$dim"] = gconfig.STANDARD_NODE_SIZE;
            
            // Hide terminal nodes
            if(con.get('hide_terminal') && node.data['terminal']) {
                node.data["$alpha"] = 0;
            }
            
            // Hide Augmented nodes
            if(con.get('hide_ner') && node.data['ner']) {
                node.data["$alpha"] = 0;
            }
                        
            // Hackily override red flags given information about incarceration
            if(node.data.enhanced != undefined) {
                if(node.data.enhanced.incarcerated || node.data.enhanced.confirmed_bad) {
                    if(!con.get('hide_ner')) {
                        node.data["overrideRedFlags"] = true;
                    } else {
                        node.data["overrideRedFlags"] = false;
                    }
                }
            }

            var totalRedFlags = node.data["totalRedFlags"];
            if(!node.data['overrideRedFlags']) {
                if(totalRedFlags == undefined) {
                    node.data["$color"] = "grey"
                } if(totalRedFlags < 1) {
                    node.data["$color"] = "green"
                } else if (totalRedFlags >= 1 & totalRedFlags < 2) {
                    node.data["$color"] = "yellow"
                } else if (totalRedFlags >= 2 & totalRedFlags < 4){
                    node.data["$color"] = "orange"
                } else if (totalRedFlags >= 4){
                    node.data["$color"] = "red"
                }
            } else {
                node.data["$color"] = "red"
            }
        },
        onBeforeCompute: function(node) {
            var inf = networkInfo(node);
            inf.then(function(html) {
                $jit.id('inner-details').innerHTML = html;
            })
        }
    });
    return rgraph;
};

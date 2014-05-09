// -------------------------------------------------------------
// ------------------ Network Visualization --------------------
// -------------------------------------------------------------


App.NetView = Ember.View.extend({
    render: function(buffer){
        buffer.push('<div id="center-container">\
                        <div id="infovis"></div>\
                    </div>');
    },
    didInsertElement: function() {
//        var pcontent = getCenter(this.data.get('content').cik);
        var pcontent = getCenter();
        pcontent.success(function(center) {
            console.log('pcontent:', center);
            getNeighbors(center).success(function(neighbors) {
                var json   = procElastic(center, neighbors, []);
                var rgraph = makeRGraph();
                rgraph.loadJSON(json);
                rgraph.refresh();
            });
        });
    }
});

// Get initial data for a company
function getCenter(node){
    if(node != undefined) {
        node.setData('explored', true);
        var cik = node.id;
    } else {
        var cik = 'test1'
    }
    var q = {
        "query": {
            "match": {
                "_id" : cik
            }
        },
        "size" : 9999
    }
        
    return $.ajax({
        type: 'POST',
        url: 'http://localhost:9200/network/_search',
        data: JSON.stringify(q)
    });
}

//
function getNeighbors(center){

    var out = [];
    var neibs = center.hits.hits[0]._source.adjacencies;
    console.log(neibs);
    var neib_query = "";
    for(i = 0; i < neibs.length; i ++){
        out.push(neibs[i].nodeTo);
        neib_query += " " + neibs[i].nodeTo;
    };
    
     var q = {
        "query": {
            "match": {
                "id" : {
                    "query" : neib_query,
                    "operator" : "or"
                }
            }
        },
        "size" : 9999
    }
    
    return $.ajax({
        type: 'POST',
        url: 'http://localhost:9200/network/_search',
        data: JSON.stringify(q)
    });
}

function procElastic(center, neighbors, network){
    var orig = network.length == 0;
    console.log('center', center);
    console.log('neighbors', neighbors);

    if(orig) {
        var ths = center.hits.hits[0]._source;
        ths.data.explored = true;
        network.push(ths);
    } else {
        var tht = network.findBy('id', center.hits.hits[0]._source.id)
        tht.data.explored = true;
        console.log('new network?', network);
    }

    // This is ignoring the connection between neighbors and center
    var neibs = neighbors.hits.hits;
    for(i = 0; i < neibs.length; i++){
        var ths = neibs[i]._source;
        var new_adjacencies = [];
        ths.adjacencies.forEach(function(a){
            var found_new = neibs.findBy('_source.id', a.nodeTo) == undefined ? false : true;
            var found_old = network.findBy('id', a.nodeTo) == undefined ? false : true;
            if(found_new || found_old) new_adjacencies.push(a);
        });
        ths.adjacencies = new_adjacencies;
        if(new_adjacencies.length == 0){
            ths.data.terminal = true;
        }
        console.log('adj', ths.adjacencies);
        var tht = network.findBy('id', ths.id)
        if(tht == undefined) {
            ths.data.explored = false;
            network.push(ths);
        } else {
            tht = ths;
        }
    }
    
    console.log("procElastic network", network);
    return network;
}

function makeRGraph() {
        var rgraph = new $jit.RGraph({
            injectInto: 'infovis',
            background: {
              CanvasStyles: {
                strokeStyle: '#555'
              }
            },
            Navigation: {
                enable  : true,
                panning : true,
                zooming : 10
            },
            Node: {
                color   :'#ddeeff'
            },
            Edge: {
                color     :'red',
                lineWidth :1.5
            },
            duration: 1000,
            interpolation: 'polar',
            onCreateLabel: function(domElement, node){
                domElement.innerHTML = node.name;
                domElement.onclick = function(){
                    node.setData('color', 'green')
                    var pexp = getCenter(node);
                    pexp.success(function(center){
                        getNeighbors(center).success(function(neighbors) {
                            var new_json = procElastic(center, neighbors, rgraph.json);
                            console.log(new_json);
                            rgraph.op.sum(new_json, {
                                type: 'fade',
                                duration: 100,
                                hideLabels: false
                            });
                            rgraph.onClick(node.id)
                        });
                    });
                };
            },
        //Change some label dom properties.
        //This method is called each time a label is plotted.
        onPlaceLabel: function(domElement, node){
            var style = domElement.style;
            style.display = '';
            style.cursor = 'pointer';

            if (node._depth <= 1) {
                style.fontSize = "1em";
                style.color = "#ccc";
            } else if(node._depth >= 2){
                style.fontSize = "0.7em";
                style.color = "#494949";
            }

            var left = parseInt(style.left);
            var w = domElement.offsetWidth;
            style.left = (left - w / 2) + 'px';
        },
        onRightClick: function(node, eventInfo, e) {
            console.log('right clicked on ', node)
        },
        onBeforePlotNode: function(node){
            console.log(node);
            if(node.data.explored){
                console.log(node.id, 'has been explored');
            } else {
                console.log(node.id, 'has NOT been explored');
            }
        }
    });
    return rgraph;
}



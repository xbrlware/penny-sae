// -------------------------------------------------------------
// ------------------ Network Visualization --------------------
// -------------------------------------------------------------

// Get initial data for a company
function netData(content){
    console.log("net company:", content);
    var net = content.source.net;

    // Figure out children of central node
    children = [];
    for(i=0; i < net.owner.length; i++){
        children.push({
            nodeTo: net.owner_cik[i],
            data: {
                weight: 1
            }
        });
    };

    // Add central node
    var nodes = [];
    nodes.push({
        id          : content.cik,
        name        : content.get('currentName'),
        adjacencies : children
    });
    
    // Entries for all other nodes
    for(i=0; i < net.owner.length; i++){
        nodes.push({
            id: net.owner_cik[i],
            name: net.owner[i],
            data: {
                relation: net.owner_type[i]
            },
            adjacencies: []
        });
    };
    
    console.log('nodes from netdata', nodes)
    return nodes;
}

function explore(adj, node){
    var q = {
        "query": {
            "filtered": {
               "query": {
                    "match_all": {}
               },
               "filter": {
                   "or": {
                      "filters": [
                            { "term": {"_id": node.id} },
                            { "term": { "net.owner_cik": node.id }
    }]}}}}}
    
    return promise = $.ajax({
        type: 'POST',
        url: 'http://localhost:9200/_search',
        data: JSON.stringify(q)
    });
};

function neibsToJSON(data, adj, node) {
    if(data.hits.total > 0){
        // For each hit
        adj = [];
        data.hits.hits.forEach(function(x){
            console.log('<<< new hit >>>')
            var c = App.CompanyData.create();
            c.set('cik', x._id);
            c.set('source', x._source);
            c.set('fields', x.fields);
            
            var n = adj.findBy("id", c.get('cik'));
            console.log(n);
            
            // Add link between each hit and clicked node
            if(n != undefined){
                n.adjacencies.push(node.id);
                n.adjacencies = $.unique(n.adjacencies);
            } else {
                adj.push({
                    id: c.get('cik'),
                    name: c.get('currentName'),
                    adjacencies: [node.id]      // Need to add other adjacencies here
                })
            }
            
            // --- EDIT ---
            if(x._id == node.id){
                // Node is an issuer
            } else {
                // Node is an owner
            }
            
        });
        console.log('adj', adj);
        return adj;
    } else {
        alert('no neighbors for this point')
    }
}

App.NetView = Ember.View.extend({
    render: function(buffer){
        buffer.push('<div id="center-container">\
                        <div id="infovis"></div>\
                    </div>');
    },
    didInsertElement: function(){
    
        var content = this.data.get('content');
        
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
                    var pexp = explore(rgraph.json, node);
                    pexp.success(function(neibs) {
                        
                        console.log('trying cik', node.id);
                        console.log('data from promise', neibs);
                        neibs = neibsToJSON(neibs, rgraph.json, node)
                        rgraph.op.sum(neibs, {
                            type: 'fade',
                            duration: 100,
                            hideLabels: false
                        });
                        node.setData("color", "green");
                        rgraph.onClick(node.id)
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
        }
    });
    rgraph.loadJSON(netData(content));
    rgraph.refresh();
}
});



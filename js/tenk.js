// ----------------------------------------------------------
// -------------- TenK Self Descriptions --------------------
// ----------------------------------------------------------
App.TenKView = Ember.View.extend({
    render: function(buffer){
        buffer.push('<div id="tenk_chart" style="width:70%; height:300px;"></div>');
    },
    didInsertElement: function() {
        this.makeTenKPlot();
    },
    makeTenKPlot: function(){
        var env  = this.$().get(0);
        var con  = this.get('controller').get('content');
        var data = con.source.tenk;
        
        var ser = fromNXYTenK(data.delta, data.date);
        var chart = new Rickshaw.Graph({
            element  : env.querySelector('#tenk_chart'),
            width    : .7 * window.innerWidth,
            height   : 300,
            min      : -0.1,
            max      : 1.1,
            renderer : 'multi',
            interpolation: 'linear',
            series: [{
                color:  'blue',
                data:   ser,
                name:   "Description Change",
                renderer : 'line'
            },
            {
                color:  'black',
                data:   ser,
                name:   "Description Change",
                renderer : 'scatterplot'
            }]
        });
        
        var chart_hoverDetail = new Rickshaw.Graph.HoverDetail( {graph: chart} );
        var chart_axes        = new Rickshaw.Graph.Axis.Time( {graph: chart} );
        var chart_yaxes       = new Rickshaw.Graph.Axis.Y({graph: chart});
        
        chart.render();
    }

})

function fromNXYTenK(y, date) {
    var out = [];
    for(i=0; i < date.length; i++){
        var obj = new Object;
        obj.y = y[i] || 0; obj.x = new Date(date[i]).getTime() / 1000;
        out.push(obj)
    }
    return out;
}


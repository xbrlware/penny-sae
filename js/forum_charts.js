
// Make all plots N days wide, regardless of whether there's data...

N_DAYS = 5; // In production, this should be more like 30, 60, 90, 180...

App.BigcswView = Ember.View.extend({
    render: function(buffer){
        buffer.push('<center>')
        buffer.push('<div style="border:1px solid black; width:70%; height:50%;" id="csw"></div>');
        buffer.push('<center>')
    },
    didInsertElement : function() {
        this.makePlot()
    },
    makePlot : function() {
        var env  = this.$().get(0);
        var all  = this.get('d');
        
        var dat = all.map(function(z) {
            return {"x" : new Date(z.date).getTime() / 1000, "y" : z.p_susp_lb} // scaling
        });
        
        var csw = new Rickshaw.Graph({
            element: env.querySelector('#csw'),
            width: .7 * window.innerWidth,
            height: .7 * window.innerHeight,
            renderer: 'bar',
            min: -10,
            max: 110,
            series: [{
                color:  'red',
                data:   dat,
                name:   "CSW"
            }]
        });
        
        var hoverDetail = new Rickshaw.Graph.HoverDetail( { graph: csw } );
        var csw_axes        = new Rickshaw.Graph.Axis.Time( { graph: csw } );
        var csw_yaxes       = new Rickshaw.Graph.Axis.Y({graph : csw});
        csw.render();
    }
});

function fromNXY2(y, date) {

    y = y instanceof Array ? y : [y];
    date = date instanceof Array ? date : [date];

    var out = [];
    for(i=0; i < date.length; i++){
        var obj = new Object;
        obj.y = y[i]; obj.x = new Date(date).getTime() / 1000;
        out.push(obj)
    }
    return out;
};


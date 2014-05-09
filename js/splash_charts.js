
// Make all plots N days wide, regardless of whether there's data...

N_DAYS = 5; // In production, this should be more like 30, 60, 90, 180...

App.CswView = Ember.View.extend({
    render: function(buffer){
        buffer.push('<div style="width:300px; height:100px;" id="csw"></div>');
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
            width: 300,
            height: 100,
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


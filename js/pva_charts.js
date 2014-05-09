// ----------------------------------------------
// -------------- PVA Charts --------------------
// ----------------------------------------------
App.ChartView = Ember.View.extend({
    render: function(buffer){
        d3.select("#price_chart").remove();
        buffer.push('<center><div>')
        buffer.push('<div id="price_chart" style="width:70%;height:300px;"></div>');
        buffer.push('<div id="slider" style="width: 70%;height:70px;"></div>');
        buffer.push('<div id="vol_chart" style="width:70%;height:300px;"></div>');
        buffer.push('</div></center>')
    },
    didInsertElement: function() {
        this.makePlot();
    },
    controllerChanged: function() {
        $('#price_chart').html('');
        $('#slider').html('');
        $('#vol_chart').html('');
        this.makePlot();
    }.observes('controller.model'),
    makePlot: function(){
        var env  = this.$().get(0);
        var con  = this.get('controller').get('content');
        var data = con.source.pv;
        
        var min_price = Math.min.apply(Math, data.close);
        var max_price = Math.max.apply(Math, data.close);
        var padd = .1 * (max_price - min_price);
        
        var price = new Rickshaw.Graph({
            element: env.querySelector('#price_chart'),
            width: .7 * window.innerWidth,
            height: 300,
            renderer: 'line',
            min: min_price - padd,
            max: max_price + padd,
            series: [{
                color:  'green',
                data:   fromNXY(data.close, data.date),
                name:   "Price"
            }]
        });
        var price_hoverDetail = new Rickshaw.Graph.HoverDetail( {graph: price} );
        var price_axes        = new Rickshaw.Graph.Axis.Time( {graph: price} );
        var price_yaxes       = new Rickshaw.Graph.Axis.Y({graph : price});

        var max_price = Math.max.apply(Math, data.vol);
        var padd = .1 * max_price;
        var vol = new Rickshaw.Graph({
            element: env.querySelector('div[id="vol_chart"]'),
            width: .7 * window.innerWidth,
            height: 300,
            renderer: 'bar',
            min: -padd,
            max: max_price + padd,
            series: [{
                color: 'red',
                data: fromNXY(data.vol, data.date),
                name: "Volume"
            }]
        });
        var vol_hoverDetail = new Rickshaw.Graph.HoverDetail( { graph: vol } );
        var vol_axes        = new Rickshaw.Graph.Axis.Time( { graph: vol } );
        var vol_yaxes       = new Rickshaw.Graph.Axis.Y({graph : vol});
//      Can't get this to work right now...
        var preview = new Rickshaw.Graph.RangeSlider.Preview( {
            graph: price,
            element: env.querySelector('#slider'),
        } );
        price.render();
        vol.render();
    }

})

function fromNXY(y, date) {
    var out = [];
    for(i=0; i < date.length; i++){
        var obj = new Object;
        obj.y = y[i]; obj.x = new Date(date[i]).getTime() / 1000;
        out.push(obj)
    }
    return out;
}


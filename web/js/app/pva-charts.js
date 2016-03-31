// web/js/app/pva-charts.js

// ---------------------------------------------------------------------------
// -------------- Price/Volume/Suspicious Activity Charts --------------------
// ---------------------------------------------------------------------------

App.PvChartRoute = Ember.Route.extend({
    model: function() {
        var pv          = this.modelFor('detail').source.pv;
        var cs          = this.modelFor('detail').source.crowdsar_new;
        var tout        = this.modelFor('detail').source.tout;
        var spikesTable = this.modelFor('detail').get('spikesTable');

        var mod = {'pv' : pv, 'cs' : cs, 'tout' : tout, 'spikesTable' : spikesTable};
        console.log(mod);
        return mod;
    }
});


App.PvChartView = Ember.View.extend({
  didInsertElement: function() {
    var margin  = {top: 10, right: 20, bottom: 300, left: 50};
    var margin2 = {top: 330, right: 20, bottom: 110, left: 50};
    var margin3 = {top: 230, right: 20, bottom: 190, left: 50};

    var width   = Ember.$('#container-pvchart').width() - margin.left - margin.right;

    var height  = 500 - margin.top - margin.bottom;
    var height2 = 500 - margin2.top - margin2.bottom;
    var height3 = 500 - margin3.top - margin3.bottom;
    
    var x = techan.scale.financetime().range([0, width]);
    var x2 = techan.scale.financetime().range([0, width]);

    var y = d3.scale.linear().range([height, 0]);
    var y2 = d3.scale.linear().range([height2, 0]);
    var y3 = d3.scale.linear().range([height3, 0]);

    var yVolume = d3.scale.linear().range([y(0), y(0.3)]);


    var brush = d3.svg.brush().on("brushend", draw);

    var price = techan.plot.close().xScale(x).yScale(y);

    var volume = techan.plot.volume().xScale(x).yScale(yVolume);

    var close = techan.plot.close().xScale(x2).yScale(y2);

    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    var xAxis2 = d3.svg.axis().scale(x2).orient("bottom");

    var yAxis = d3.svg.axis().scale(y).orient("left");
    var yAxis2 = d3.svg.axis().scale(y2).ticks(0).orient("left");
    var yAxis3 = d3.svg.axis().scale(y3).ticks(0).orient("left");

    var ohlcAnnotation = techan.plot.axisannotation()
            .axis(yAxis)
            .format(d3.format(',.2fs'));

    var timeAnnotation = techan.plot.axisannotation()
            .axis(xAxis)
            .format(d3.time.format('%Y-%m-%d'))
            .width(65)
            .translate([0, height]);

    var crosshair = techan.plot.crosshair()
            .xScale(x)
            .yScale(y)
            .xAnnotation(timeAnnotation)
            .yAnnotation(ohlcAnnotation);

    var svg = d3.select("#container-pvchart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

    var focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    focus.append("clipPath")
            .attr("id", "clip")
        .append("rect")
            .attr("x", 0)
            .attr("y", y(1))
            .attr("width", width)
            .attr("height", y(0) - y(1));

    focus.append("g")
            .attr("class", "volume")
            .attr("clip-path", "url(#clip)");

    focus.append("g")
            .attr("class", "price")
            .attr("clip-path", "url(#clip)");

    focus.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")");

    focus.append("g")
            .attr("class", "y axis")
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Price ($)");

    focus.append('g')
            .attr("class", "crosshair")
            .call(crosshair);
          
    var context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    context.append("g")
            .attr("class", "close");

    context.append("g")
            .attr("class", "pane");

    context.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height2 + ")");

    context.append("g")
            .attr("class", "y axis")
            .call(yAxis2);



    var crowdsar = svg.append("g")
            .attr("class", "crowdsar")
            .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");
    
    crowdsar.append("g").attr("class", "x axis").attr("transform", "translate(0," + height3 + ")");
    crowdsar.append("g").attr("class", "y axis").call(yAxis3);



    var zoomable, zoomable2;

    var model = this.get('controller').get('model');
    var data = [];
    for (var i = 0; i < model.pv.vol.length; i++) {
       data.push({date: new Date(model.pv.date[i]),
         volume: model.pv.vol[i],
         close: model.pv.close[i],
         open: model.pv.close[i] ,
         high: model.pv.close[i],
         low: model.pv.close[i]});
     }

     var accessor = price.accessor();

     x.domain(data.map(accessor.d));
     x2.domain(x.domain());
     y.domain(techan.scale.plot.ohlc(data, accessor).domain());
     y2.domain(y.domain());
     yVolume.domain(techan.scale.plot.volume(data).domain());

     focus.select("g.price").datum(data);
     focus.select("g.volume").datum(data);

     context.select("g.close").datum(data).call(close);
     context.select("g.x.axis").call(xAxis2);

     // Associate the brush with the scale and render the brush only AFTER a domain has been applied
     zoomable = x.zoomable();
     zoomable2 = x2.zoomable();
     brush.x(zoomable2);
     context.select("g.pane").call(brush).selectAll("rect").attr("height", height2);

     draw();
    
    function draw() {
      var priceSelection = focus.select("g.price");
      var data = priceSelection.datum();

      zoomable.domain(brush.empty() ? zoomable2.domain() : brush.extent());
      y.domain(techan.scale.plot.ohlc(data.slice.apply(data, zoomable.domain()), price.accessor()).domain());
      priceSelection.call(price);
      focus.select("g.volume").call(volume);
      // using refresh method is more efficient as it does not perform any data joins
      // Use this if underlying data is not changing
      //        svg.select("g.price").call(price.refresh);
      focus.select("g.x.axis").call(xAxis);
      focus.select("g.y.axis").call(yAxis);
    }   
  }
});

/*
App.PvChartView = Ember.View.extend({
    didInsertElement : function(){
        var mod     = this.get('controller').get('model');
		    var close   = [];
        var vol     = [];
        var susp_lb = [];
        var p_toutw = [];
        
        // Price + Volume (for first instrument)
		for (i = 0; i < mod.pv.close.length; i++) {
			var date = new Date(mod.pv.date[i]).getTime();
            close.push([ date, mod.pv.close[i] ]);
            vol.push([ date,  mod.pv.vol[i] ])
		};
        
        // CS
        if(mod.cs !== undefined) {
            var haveForum = Object.keys(mod.cs).length > 1
            if(haveForum){
                for (i = 0; i < mod.cs.date.length; i++) {
                    var date = new Date(mod.cs.date[i]).getTime();
                    susp_lb.push([ date, Math.round(mod.cs.p_susp_lb[i] * 1000) / 10 ]);
                };
            };
        };

        // Tout
        if(mod.tout !== undefined) {
            var haveTout = Object.keys(mod.tout).length > 1
            if(haveTout){
                for (i = 0; i < mod.tout.date.length; i++) {
                    var date = new Date(mod.tout.date[i]).getTime();
                    p_toutw.push([ date, Math.round(mod.tout.p_toutw[i] * 1000) / 10 ]);
                };
            };
        };

        // Plot
        pv_opts = this.make_pv_opts(close, vol, susp_lb, p_toutw);
		$('#container-pvchart').highcharts('StockChart', pv_opts);
    },
    make_pv_opts : function(close, vol, susp_lb, p_toutw) {
        var opts = {
		    credits: { enabled: false },
		    rangeSelector: {
				inputEnabled: $('#container-pvchart').width() > 480,
		        selected: 2
		    }
        };
                
        opts.yAxis = [];
        opts.series = [];
        // Adding price
        opts.yAxis.push({
            labels: {
                align: 'right',
                x : -3
            },
            title: {
                text: 'Price'
            },
            height: '50%',
            lineWidth: 2
        })
        
        opts.series.push({
            type: 'line',
            name: 'Price',
            data: close,
            yAxis : 0
        })
        
                
        if(susp_lb.length > 0){
            opts.yAxis.push({
		        labels: {
		    		align: 'right',
		    		x: -3
		    	},
		        title: {
		            text: 'CROWDSAR'
		        },
                top       : '55%',
		        height    : '20%',
                offset    : 0,
		        lineWidth : 1,
                max       : 5
            });

            opts.yAxis.push({
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: 'Volume'
                },
                top       : '80%',
                height    : '20%',
                offset    : 0,
                lineWidth : 2
            });
            
            opts.series.push({name: 'CROWDSAR',
		        data: susp_lb,
                color: 'red',
		        type: 'column',
                yAxis: 1
		    });
            
            opts.series.push({name: 'Volume',
		        data: vol,
                type: 'column',
		        yAxis: 2
            });
            
            band = [];
            band.push([Date.UTC(1990, 0, 1), 5]);
            band.push([Date.UTC(2014, 3, 1), 5]);
            
            opts.series.push({
                        type: 'area',
                        data: band,
                        color : 'lightgrey',
                        showInLegend: false,
                        yAxis: 1,
                        enableMouseTracking: false
            })
        } else {
            opts.yAxis.push({
                labels: {
                        align: 'right',
                        x: -3
                    },
                title: {
                        text: 'Volume'
                },
                top: '55%',
                height: '45%',
                offset: 0,
                lineWidth: 2
            });
            
            opts.series.push({name: 'Volume',
		        data: vol,
                type: 'column',
		        yAxis: 1
            });
        }
    
        return opts;
    }
});*/

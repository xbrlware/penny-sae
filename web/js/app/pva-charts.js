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
});
            

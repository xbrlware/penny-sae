// ---------------------------------------------------------------------------
// -------------- Price/Volume/Suspicious Activity Charts --------------------
// ---------------------------------------------------------------------------

function fetch_tts(args){
    $.ajax({
        type    : 'POST',
        dataType: 'json',
        url     : config.SERVER_PATH + 'fetch_tts',
        data    : JSON.stringify({
                    "query_args" : args.query_args
                  }),
        success : args.callback,
        error   : function (xhr, status, error) {
                    console.log('Error: ' + error.message);
                  }
    });
};

App.TopicTimeSeriesController = Ember.ObjectController.extend({});

App.TopicTimeSeriesView = Ember.View.extend({
    templateName : "topic-time-series",
    controllerChanged: function() {
        var st   = this.get('controller').get('searchTerm_topic');
        var self = this;
        fetch_tts({
            query_args : {"searchTerm" : st},
            callback   : function(tts) {
                self.makeTopicTS(st, tts);
            }
        });
    }.observes('controller.model'),
    didInsertElement : function() {
        var st   = this.get('controller').get('searchTerm_topic');
        var self = this;
        fetch_tts({
            query_args : {"searchTerm" : st},
            callback   : function(tts) {
                self.makeTopicTS(st, tts);
            }
        });
    },
    makeTopicTS : function(st, tts) {
        var tts_array = _.map(tts, function(x) {
            return [ new Date(x.key_as_string).getTime(), x.doc_count ]
        });
        tts_opts = this.make_tts_opts(st, tts_array);
        $('#container-ttschart').highcharts('StockChart', tts_opts);
    },
    make_tts_opts : function(st, tts) {
            
        var opts = {
		    credits: { enabled: false },
		    rangeSelector: {
				inputEnabled: $('#container-ttschart').width() > 480,
		        selected: 5
		    }
        };
        
        opts.yAxis  = [];
        opts.series = [];
        opts.yAxis.push({
            labels: {
                align  : 'right',
                x      : -3
            },
            title: {
                text: 'Prevalance'
            },
            lineWidth: 2
        });
        
        opts.series.push({
            type: 'line',
            name: 'Mentions of "'+ st + '"',
            data: tts,
            yAxis : 0,
            color : "green"
        });
        
        return opts;
    }
});

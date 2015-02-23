
App.TopicPieChartController = Ember.ObjectController.extend({});

App.TopicPieChartView = Ember.View.extend({
    controllerChanged: function() {
        console.log('reloading...');
        this.makeChart(this);
    }.observes('controller.model'),
    didInsertElement : function() {
        this.makeChart(this)
    },
    makeChart: function(self) {
        var con     = self.get('controller');
        var cd_last = con.get('cd_last');

        var data = [];
        others = 0;
        cd_last.map(function(x) {
            if(x[1] > 2) {
                data.push({label: x[0], data: x[1]})
            } else {
                others += x[1]
                return
            }
        });
        
        data.push({label: "Misc. Others", data: others, color: "lightgrey"})
        console.log('data', data);
        $.plot('#placeholder', data, {
            series: {
                pie: {
                    show: true
                }
            }
        });
    }
});


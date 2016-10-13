// web/js/app/sic-piechart.js

/* global Ember, App */

App.TopicPieChartController = Ember.ObjectController.extend({});

App.TopicPieChartView = Ember.View.extend({
  controllerChanged: function () {
    this.makeChart(this);
  }.observes('controller.model'),
  didInsertElement: function () {
    this.makeChart(this);
  },
  makeChart: function (self) {
    var con = self.get('controller');
    var cdLast = con.get('cdLast');

    var data = [];
    var others = 0;
    cdLast.map(function (x) {
      if (x[1] > 2) {
        data.push({label: x[0], data: x[1]});
      } else {
        others += x[1];
        return;
      }
    });

    data.push({label: 'Misc. Others', data: others, color: 'lightgrey'});
    Ember.$.plot('#placeholder', data, {
      series: {
        pie: {
          show: true
        }
      }
    });
  }
});

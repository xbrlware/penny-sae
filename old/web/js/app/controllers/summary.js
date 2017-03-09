// web/js/app/summary.js
/* global Ember, App, d3, _ */

'use strict';

App.SummaryController = Ember.Controller.extend({
  application: Ember.inject.controller(),
  searchTerm: Ember.computed.alias('application.searchTerm'),
  chartObj: App.Chart.create(),
  createChartDimensions: function (id, hMultiplier, time) {
    var r = {};
    r['width'] = Ember.$(id).width() * 0.8;
    r['height'] = r.width * hMultiplier;
    if (time) {
      r['x'] = d3.time.scale().range([0, r.width]);
    } else {
      r['x'] = d3.scale.ordinal().rangeRoundBands([0, r.width], 0.5);
    }
    r['y'] = d3.scale.linear().range([r.height, 0]);
    return r;
  },

  drawDateHistogram: function () {
    var data = _.map(this.get('model.date_histogram'), function (d) {
      return {date: new Date(d.time), close: d.doc_count};
    });
    var dateFilter = d3.extent(data, function (d) { return d.date; });

    var parseDateTip = d3.time.format('%b-%d');
    var a = this.createChartDimensions('.date-histogram', 0.6, true);

    var histogramObj = {
      id: '.date-histogram',
      margin: { top: 10, bottom: 25, left: 45, right: 40 },
      title: '',
      class: 'date-histogram',
      clip: 'c1',
      width: a.width + 35 + 40,
      height: a.height,
      x: a.x,
      y: a.y.nice(),
      xAxis: d3.svg.axis().scale(a.x).ticks(d3.time.months, 3).orient('bottom'),
      yAxis: d3.svg.axis().scale(a.y).orient('left').ticks(4),
      tip: d3.tip().attr('class', 'histogram-tip').offset([-10, -2]).html(function (d) {
        return '<center><span>' + parseDateTip(d.date) + '</span><br /><span>' + d.close + '</span></center>';
      })
    };

    this.chartObj.makeClose(histogramObj, data, dateFilter);
  },

  drawSicHistogram: function () {
    var data = _.map(this.get('model.sic_histogram'), function (d) {
      return {date: d.key, volume: d.doc_count};
    });

    var a = this.createChartDimensions('.sic-histogram', 0.6, false);

    var histogramObj = {
      id: '.sic-histogram',
      margin: { top: 10, bottom: 25, left: 45, right: 40 },
      title: '',
      class: 'sic-histogram',
      clip: 'c2',
      width: a.width + 35 + 40,
      height: a.height,
      x: a.x,
      y: a.y.nice(),
      xAxis: d3.svg.axis().scale(a.x).orient('bottom').tickFormat(function () { return ''; }),
      yAxis: d3.svg.axis().scale(a.y).orient('left'),
      tip: d3.tip().attr('class', 'sic-tip').offset([-10, -2]).html(function (d) {
        return '<center><span>' + d.volume + '</span></center>';
      }),
      text: true
    };

    this.chartObj.makeBarChart(histogramObj, data, null);
  }
});

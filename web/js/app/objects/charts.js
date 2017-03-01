// web/js/app/objects/charts.js
/* global Ember, App, d3, _, gconfig */

'use strict';

App.Chart = Ember.Object.extend({
  dateDiff: function (startDate, endDate) {
    /* gets amount of days between start and end - used for bar width in charts */
    // Does not take daylight savings in account
    var oneDay = 24 * 60 * 60 * 1000;
    var firstDate = new Date(startDate);
    var secondDate = new Date(endDate);

    return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
  },

  makeDiv: function (obj) {
    /* builds generic 'g' tag for each chart */
    /* obj = chart object from above, clip = name of clip path */
    d3.select(obj.id).select('svg').remove();
    var div = d3.select(obj.id).append('svg')
      .attr('width', obj.width)
      .attr('height', obj.height + obj.margin.top + obj.margin.bottom)
      .style('padding-left', obj.margin.left)
      .style('padding-top', obj.margin.top);

    div.append('g').attr('class', 'focus1').attr('id', obj.class)
      .attr('transform',
          'translate(' + 35 + ', -' + 0 + ')');

    div.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + obj.height + ')');

    div.append('g')
      .attr('class', 'y axis')
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text(obj.title);

    return div;
  },

  makeBarChart: function (chartObj, data, dateFilter) {
    var _data;
    if (!chartObj.div) {
      // init svg tree
      chartObj.div = this.makeDiv(chartObj);
      chartObj.div.select('g.' + chartObj.class).datum(data);
    }

    if (dateFilter) {
      _data = _.filter(data, function (x) {
        return x.date > dateFilter[0] & x.date < dateFilter[1];
      });
      chartObj.x.domain(dateFilter);
      chartObj.y.domain(d3.extent(_data, function (d) { return d.volume; }));
    } else {
      _data = data;
      chartObj.x.domain(_.map(_data, function (d) { return d.date; }));
      chartObj.y.domain([0, d3.max(_data, function (d) { return d.volume; })]);
    }

    chartObj.div.selectAll('.bar').remove();

    var barWidth;
    if (dateFilter) {
      var dd = this.dateDiff(chartObj.x.domain()[0], chartObj.x.domain()[1]);
      barWidth = chartObj.width / dd;
    } else {
      barWidth = chartObj.x.rangeBand();
    }

    chartObj.div.selectAll('.bar')
      .data(_data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', function (d) { return chartObj.x(d.date); })
      .attr('width', barWidth)
      .attr('y', function (d) { return chartObj.y(d.volume); })
      .attr('height', function (d) { return chartObj.height - chartObj.y(d.volume); });

    if (chartObj.text) {
      chartObj.div.selectAll('.bartext')
        .data(_data)
        .enter()
        .append('text')
        .attr('class', 'bartext')
        .attr('text-anchor', 'start')
        .attr('transform', function (d) { return 'rotate(-90)'; })
        .attr('fill', 'black')
        .attr('x', function (d, i) { return -chartObj.height + 2; })
        .attr('y', function (d, i) { return chartObj.x(d.date) - 2; })
        .text(function (d) { return d.date; });
    }
    // draw the axis
    chartObj.div.select('g.x.axis').call(chartObj.xAxis);

    if (chartObj.text) {
      chartObj.div.selectAll('g.x.axis g.tick line')
        .attr('y2', function (x) { return 0; });
    }

    if (!chartObj.brush) {
      chartObj.div.select('g.y.axis').call(chartObj.yAxis);
    }

    if (chartObj.tip) {
      chartObj.div.selectAll('.bar')
        .on('mouseover', chartObj.tip.show)
        .on('mouseout', chartObj.tip.hide);
      chartObj.div.call(chartObj.tip);
    }

    // draw brush if it is a brush object
    if (chartObj.brush) {
      chartObj.div.append('g')
        .attr('class', 'x brush')
        .call(chartObj.brush)
        .selectAll('rect')
        .attr('y', 0)
        .attr('height', chartObj.height);
    }
  },

  makeTimeSeries: function (ts, bounds) {
    /* Builds time series for users using D3 */
    var div = ts.id;
    var margin = {top: 13, right: 20, bottom: 20, left: 0};
    var FILL_COLOR = 'orange';
    var TEXT_COLOR = '#ccc';
    var data = ts.timeseries;

    // format date for D3
    var parseDate = d3.time.format('%b-%d');
    var meanFormat = d3.format('.2f');

    // Clear previous values
    d3.select(div).selectAll('svg').remove();

    // acquire user name and number of posts
    d3.select(div + ' .title').text(ts.name);
    d3.select(div + ' .during').html('<span>Posts: ' + ts.count.during + '</span>');

    // init
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-5, 0])
      .html(function (d) {
        return '<center><span>' + parseDate(d.date) + '</span><br /><span>' + d.value + '</span></center>';
      });

    // Get cell height
    var height = (margin.top + margin.bottom) * 1.5;
    var width = (Ember.$('#gauge-timeline-cell').width() * 0.60);

    // set x scale and domain
    var x = d3.time.scale().range([0, width - (margin.left + margin.right)]);
    x.domain(d3.extent([bounds.xmin, bounds.xmax])).nice();

    // set y scale and domain
    var y = d3.scale.linear().range([height, 0]);
    y.domain([0, ts.max]);

    // figure out width of bar
    var dd = this.dateDiff(x.domain()[0], x.domain()[1]);
    var barWidth = width / dd;

    var svg = d3.select(div).append('svg:svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var yaxis = d3.svg.axis()
      .scale(y)
      .orient('right')
      .tickFormat(d3.format('.f'))
      .tickValues([meanFormat(ts.mean), ts.max]);

    var xaxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .ticks(4)
      .tickFormat(d3.time.format('%m/%y'));

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xaxis)
      .attr('stroke', TEXT_COLOR);

    svg.append('g')
      .attr('class', 'y axis timeline')
      .attr('transform', 'translate(' + (width - margin.right) + ',0)')
      .call(yaxis)
      .attr('stroke', TEXT_COLOR);

    svg.selectAll('bar')
      .data(data)
      .enter().append('rect')
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .style('fill', FILL_COLOR)
      .attr('x', function (d) { return x(d.date); })
      .attr('width', barWidth)
      .attr('y', function (d) { return y(d.value); })
      .attr('height', function (d) { return height - y(d.value); });

    svg.call(tip);
  },

  makeClose: function (chartObj, data, dateFilter) {
    /* handles drawing each close chart */
    if (!chartObj.div) {
      // init svg tree
      chartObj.div = this.makeDiv(chartObj);
      chartObj.div.select('g.' + chartObj.class).datum(data);

      // define clip path
      chartObj.div.append('defs').append('clipPath')
        .attr('id', chartObj.clip)
        .append('rect')
        .attr('x', 0)
        .attr('y', chartObj.y(1))
        .attr('width', chartObj.width)
        .attr('height', chartObj.y(0) - chartObj.y(1));

      // set clip path
      chartObj.div.append('g')
        .attr('class', chartObj.class)
        .attr('clip-path', 'url(#' + chartObj.clip + ')');
    }

    var _data = _.filter(data, function (d) {
      return d.date > dateFilter[0] & d.date < dateFilter[1];
    });

    if (_data.length !== data.length) {
      chartObj.x.domain(dateFilter);
      chartObj.y.domain(d3.extent(_data, function (d) { return d.close; }));
    } else {
      chartObj.x.domain(d3.extent(data, function (d) { return d.date; }));
      chartObj.y.domain(d3.extent(data, function (d) { return d.close; }));
    }

    chartObj.div.selectAll('.dot').remove();
    chartObj.div.selectAll('.line').remove();

    var line = d3.svg.line()
      .x(function (d) { return chartObj.x(d.date); })
      .y(function (d) { return chartObj.y(d.close); });

    chartObj.div.select('g.' + chartObj.class).append('path')
      .datum(_data)
      .attr('class', 'line')
      .attr('d', line);

    var opcty = chartObj.class === 'date-histogram' ? 1 : 0;

    // overlays dots so d3 tip works
    chartObj.div.selectAll('.dot')
      .data(_data)
      .enter().append('circle')
        .attr('class', 'dot')
        .attr('fill', 'red')
        .attr('opacity', opcty)
        .attr('r', 3)
        .attr('cx', function (d) { return chartObj.x(d.date); })
        .attr('cy', function (d) { return chartObj.y(d.close); })
        .on('mouseover', chartObj.tip.show)
        .on('mouseout', chartObj.tip.hide);

    chartObj.div.call(chartObj.tip);
    // draw the axis
    chartObj.div.select('g.x.axis').call(chartObj.xAxis);
    chartObj.div.select('g.y.axis').call(chartObj.yAxis);
  },

  drawGauge: function (bindTo, gaugeData) {
    /* handles drawing a single gauge using D3 */
    d3.select(bindTo).selectAll('svg').remove();
    var data = gaugeData;

    var w = gconfig.GAUGE.SIZE.WIDTH;
    var h = gconfig.GAUGE.SIZE.HEIGHT / 2;
    var c = gconfig.GAUGE.COLOR_PATT;  // all three gauge colors

    var r = w / 2;  // outside radius
    var ir = w / 4;  // inside radius
    var pi = Math.PI;
    var color = {pos: c[0], neut: c[1], neg: c[2]};
    var valueFormat = d3.format('.4p');

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-5, 0])
      .html(function (d) {
        return '<center><strong>' + d.data.label + '</strong><br /><span>' + valueFormat(d.data.value) + '</span></center>';
      });

    var vis = d3.select(bindTo).append('svg')
      .data([data])
      .attr('width', w)
      .attr('height', h)
      .append('svg:g')
      .attr('class', 'gauge-align')
      .attr('transform', 'translate(' + r + ',' + r + ')');

    vis.call(tip);

    var arc = d3.svg.arc()
      .outerRadius(r)
      .innerRadius(ir);

    var pie = d3.layout.pie()
      .sort(null)
      .value(function (d) { return d.value; })
      .startAngle(-90 * (pi / 180))
      .endAngle(90 * (pi / 180));

    var arcs = vis.selectAll('g.slice')
      .data(pie)
      .enter()
      .append('svg:g')
      .attr('class', 'slice')
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

    arcs.append('svg:path')
      .attr('fill', function (d, i) { return color[d.data.label]; })
      .attr('d', arc);

    return arcs;
  }
});

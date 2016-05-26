// web/js/app/pva-charts.js

/* global Ember, App, d3, _ */

App.PvChartRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    //        App.Search.fetch_data('cik2tickers', {'cik': controller.get('name.cik')}).then(function(response) {
    //            controller.set('tickers', response.tickers)
    //            App.Search.get_generic_detail('pv', {'ticker' : response.tickers[0]}).then(function(response) {
    //                controller.set('model', response.data)
    //            })
    //        })
    App.Search.fetch_data('pv', this.get('controller.name')).then(function (response) {
      console.log('pv response', response.data);
      controller.set('model', response.data);
      controller.set('have_records', response.data.length > 0);
    });

    App.Search.fetch_data('posts', this.get('controller.name')).then(function (response) {
      console.log('posts response', response.data);
      controller.set('posts', response.data);
    });
  }
});

App.PvChartController = Ember.Controller.extend({
  needs: ['detail'],
  name: Ember.computed.alias('controllers.detail.model'),
  have_records: true,
  posts: undefined,
  actions: {
    setTicker: function (ticker) {
      var this_ = this;
      App.Search.fetch_data('pv', {'ticker': ticker}).then(function (response) {
        this_.set('model', response.data);
      });
    }
  }
});

App.PvChartView = Ember.View.extend({
  controllerChanged: function () {
    this.drawChart(this.get('controller.model'));
  }.observes('controller.model'),

  drawChart: function (data) {
    console.log('drawChart -- data', data);
    if (!data) { return; }

    _.map(data, function (datum) { datum['date'] = new Date(datum['date']); });

    // ** This is a placeholder -- we aren't hooked into CROWDSAR backend, so we're just using PV data here again **
    var fData = data;
    _.map(fData, function (datum) { datum['date'] = new Date(datum['date']); });

    //    var fData = []
    //    for (i = 0; i < model.cs.date.length; i++) {
    //      fData.push({
    //        date: new Date(model.cs.date[i]),
    //        high: model.cs.n_post[i],
    //        close: model.cs.n_susp[i],
    //        open: model.cs.p_susp[i],
    //        volume: (model.cs.p_susp_lb[i] * 1000) / 10,
    //        low: 0})
    //    }

    var margin = {top: 0, right: 10, bottom: 200, left: 40};
    var margin2 = {top: 340, right: 10, bottom: 100, left: 40};
    var margin3 = {top: 440, right: 10, bottom: 10, left: 40};

    var width = 800 - margin.left - margin.right;

    var height = 500 - margin.top - margin.bottom;
    var height2 = 500 - margin2.top - margin2.bottom;
    var height3 = 500 - margin3.top - margin3.bottom;

    // var formatTooltipDate = d3.time.format('%b. %d, %Y');

    var x = d3.time.scale().domain(d3.extent(data, function (d) { return d.date; })).range([0, width]);
    var x2 = d3.time.scale().domain(x.domain()).range([0, width]);
    var x3 = d3.time.scale().domain(x.domain()).range([0, width]);

    var y = d3.scale.linear().domain(d3.extent(data, function (d) { return d.close; })).range([height, 0]);
    var y2 = d3.scale.linear().domain([0, d3.max(data, function (d) { return d.volume; })]).range([height2, 0]);
    var y3 = d3.scale.linear().domain(d3.extent(fData, function (d) { return d.close; })).range([height3, 0]);

    var xAxis = d3.svg.axis().scale(x).orient('bottom').tickFormat(d3.time.format('%b-%y'));
    var xAxis2 = d3.svg.axis().scale(x2).orient('bottom').tickFormat(d3.time.format('%b-%y'));
    var xAxis3 = d3.svg.axis().scale(x3).orient('bottom').tickFormat(d3.time.format('%b-%y'));

    var yAxis = d3.svg.axis().scale(y).orient('left');
    var yAxis2 = d3.svg.axis().scale(y2).orient('left').ticks(6).tickFormat(d3.format('s'));
    var yAxis3 = d3.svg.axis().scale(y3).orient('left').ticks(4);

    var bisectDate = d3.bisector(function (d) { return d.date; }).right;

    var zoom = d3.behavior.zoom().x(x).y(y).scaleExtent([1, 10]).on('zoom', zoomed);

    /*
    var volumeTip = d3.tip()
      .attr('class', 'volume-tip')
      .offset([-10, 0])
      .html(function (d) {
        return '<strong>Date: </strong><span>' + formatTooltipDate(d.date) + '</span> <br /> <strong>Volume: </strong><span>' + d.volume + '</span>';
      });

    var crowdsarTip = d3.tip()
      .attr('class', 'crowdsar-tip')
      .offset([-10, 0])
      .html(function (d) {
        return '<strong>Date: </strong><span>' + formatTooltipDate(d.date) + '</span> <br /> <strong>Crowdsar: </strong><span>' + d.close + '</span>';
      });
*/
    var line = d3.svg.line()
      .x(function (d) { return x(d.date); })
      .y(function (d) { return y(d.close); });

    var svg = d3.select('#container-pvchart').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    svg.append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', width)
      .attr('height', height);

    svg.append('defs').append('clipPath')
      .attr('id', 'clipVolume')
      .append('rect')
      .attr('width', width)
      .attr('height', height2);

    svg.append('defs').append('clipPath')
      .attr('id', 'clipCrowdsar')
      .append('rect')
      .attr('width', width)
      .attr('height', height3);

  /* svg.call(volumeTip);
    svg.call(crowdsarTip);
*/
    var focus = svg.append('g')
      .attr('class', 'focus')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .append('g')
      .call(zoom);

    var barGraph = svg.append('g')
      .attr('class', 'bar')
      .attr('transform', 'translate(' + margin2.left + ',' + margin2.top + ')');

    var crowdsar = svg.append('g')
      .attr('class', 'crowd')
      .attr('transform', 'translate(' + margin3.left + ',' + margin3.top + ')');

    focus.append('g')
      .attr('class', 'x axis focus')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    focus.append('g')
      .attr('class', 'y axis focus')
      .call(yAxis);

    focus.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', line)
      .attr('clip-path', 'url(#clip)');

    var crosshair = svg.append('g')
      .attr('class', 'crosshair')
      .style('display', 'none');

    crosshair.append('circle')
      .attr('r', 4.5);

    crosshair.append('text')
      .attr('x', 9)
      .attr('dy', '0.35em');

    focus.append('rect')
      .attr('class', 'overlay')
      .attr('width', width)
      .attr('height', height)
      .on('mouseover', function () { crosshair.style('display', null); })
      .on('mouseout', function () { crosshair.style('display', 'none'); })
      .on('mousemove', mousemove);

    barGraph.append('g')
      .attr('class', 'x axis volume')
      .attr('transform', 'translate(0,' + height2 + ')')
      .call(xAxis2);

    barGraph.append('g')
      .attr('class', 'y axis')
      .call(yAxis2);

    barGraph.append('g')
      .attr('clip-path', 'url(#clipVolume)')
      .selectAll('bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar vol')
      .attr('x', function (d) { return x2(d.date); })
      .attr('width', 3)
      .attr('y', function (d) { return y2(d.volume); })
      .attr('height', function (d) { return height2 - y2(d.volume); });
      // .on('mouseover', volumeTip.show)
      // .on('mouseout', volumeTip.hide);

    crowdsar.append('g')
      .attr('class', 'x axis crowdsar')
      .attr('transform', 'translate(0,' + height3 + ')')
      .call(xAxis3);

    crowdsar.append('g')
      .attr('class', 'y axis')
      .call(yAxis3);

    crowdsar.append('g')
      .attr('clip-path', 'url(#clipCrowdsar)')
      .selectAll('crowd')
      .data(fData)
      .enter().append('rect')
      .attr('class', 'bar crowdsar')
      .attr('x', function (d) { return x3(d.date); })
      .attr('width', 3)
      .attr('y', function (d) { return y3(d.close); })
      .attr('height', function (d) { return height3 - y3(d.close); });
    //  .on('mouseover', crowdsarTip.show)
    //  .on('mouseout', crowdsarTip.hide);

    function mousemove () {
      var x0 = x.invert(d3.mouse(this)[0]);
      var i = bisectDate(data, x0, 1);
      var d0 = data[i - 1];
      var d1 = data[i];
      var d = (x0 - d0.date) > (d1.date - x0) ? d1 : d0;
      crosshair.attr('transform', 'translate(' + (x(d.date) + margin.left) + ',' + y(d.close) + ')');
      crosshair.select('text').text(d.close);
    }

    function zoomed () {
      console.log('zoomed is being called!');
      /*        focus.attr('transform',
                  'translate(' + zoom.translate() + ')' +
                  'scale(' + zoom.scale() + ')'); */
      focus.select('.x.axis.focus').call(xAxis);
      focus.select('.y.axis.focus').call(yAxis);
      focus.selectAll('path.line').attr('d', line);
    }
  }
});

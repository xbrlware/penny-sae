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
        return mod;
    }
});

App.PvChartView = Ember.View.extend({
  didInsertElement: function() {
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

    var fData = [];
    for (var i = 0; i < model.cs.date.length; i++) {
      fData.push({
        date: new Date(model.cs.date[i]),
        high   : model.cs.n_post[i],
        close   : model.cs.n_susp[i],
        open   : model.cs.p_susp[i],
        volume: (model.cs.p_susp_lb[i] * 1000)/10,
        low: 0});
    }

    var margin = {top: 0, right: 50, bottom: 280, left: 20};
    var margin2 = {top: 440, right: 50, bottom: 20, left: 20};
    var margin3 = {top: 250, right: 50, bottom: 200, left: 20};
    var margin4 = {top: 350, right: 50, bottom: 120, left: 20};

    var width = 800 - margin.left - margin.right;

    var height = 500 - margin.top - margin.bottom;
    var height2 = 500 - margin2.top - margin2.bottom;
    var height3 = 500 - margin3.top - margin3.bottom;
    var height4 = 500 - margin4.top - margin4.bottom;

    var formatDate = d3.time.format("%b-%y");

    var x = d3.time.scale().range([0, width]);
    var x2 = d3.time.scale().range([0, width]);
    var x3 = d3.time.scale().range([0, width]);
    var x4 = d3.time.scale().range([0, width]);

    var y = d3.scale.linear().range([height, 0]);
    var y2 = d3.scale.linear().range([height2, 0]);
    var y3 = d3.scale.linear().range([0, height3]);
    var y4 = d3.scale.linear().range([0, height4]);

    var xAxis = d3.svg.axis().scale(x).orient('bottom').tickFormat(d3.time.format("%b-%y"));
    var xAxis2 = d3.svg.axis().scale(x2).orient('bottom').tickFormat(d3.time.format("%b-%y"));
    var xAxis3 = d3.svg.axis().scale(x3).orient('bottom').tickFormat(d3.time.format("%b-%y"));
    var xAxis4 = d3.svg.axis().scale(x4).orient('bottom').tickFormat(d3.time.format("%b-%y"));

    var yAxis = d3.svg.axis().scale(y).orient('right');
    var yAxis3 = d3.svg.axis().scale(y3).orient('right');
    var yAxis4 = d3.svg.axis().scale(y4).orient('right');

    var brush = d3.svg.brush()
      .x(x2)
      .on("brush", brushed);

    var line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.close); });

    var line2 = d3.svg.line()
      .x(function(d) { return x2(d.date); })
      .y(function(d) { return y2(d.close); });

    var svg = d3.select('#container-pvchart').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)

    svg.append('defs').append('clipPath')
        .attr('id', 'clip')
      .append('rect')
        .attr('width', width)
        .attr('height', height);
    
    var focus = svg.append('g')
        .attr('class', 'focus')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var barGraph = svg.append('g')
        .attr('class', 'bar')
        .attr('transform', 'translate(' + margin3.left + ',' + margin3.top + ')');
      
    barGraph.append('defs').append('clipPath')
        .attr('id', 'clipVolume')
      .append('rect')
        .attr('width', width)
        .attr('height', height3);
    
    var crowdsar = svg.append('g')
        .attr('class', 'crowd')
        .attr('transform', 'translate(' + margin4.left + ',' + margin4.top + ')');

    crowdsar.append('defs').append('clipPath')
        .attr('id', 'clipCrowdsar')
        .append('rect')
        .attr('width', width)
        .attr('height', height4);

    var context = svg.append('g')
        .attr('class', 'context')
        .attr('transform', 'translate(' + margin2.left + ',' + margin2.top + ')');

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain(d3.extent(data, function(d) { return d.close; }));
    
    x2.domain(x.domain());
    y2.domain(y.domain());

    x3.domain(x.domain());
    y3.domain([0, d3.max(data, function(d) { return d.volume; })]);

    x4.domain(x.domain());
    y4.domain(d3.extent(fData, function(d) { return d.close; }));


    focus.append('g')
        .attr('class', 'x axis focus')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    focus.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate('+ width + ',0)')
        .call(yAxis);
    
    focus.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('d', line)
        .attr('clip-path', 'url(#clip)');

    barGraph.append('g')
        .attr('class', 'x axis volume')
        .attr('transform', 'translate(0,' + height3 + ')')
        .call(xAxis3);

    barGraph.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate('+ width + ',0)')
        .call(yAxis3)

    barGraph.append('g')
        .attr('clip-path', 'url(#clipVolume)')
      .selectAll('bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar vol')
        .style('fill', 'steelblue')
        .attr('x', function(d) { return x3(d.date); })
        .attr('width', 3)
        .attr('y', function(d) { return y3(d.volume); })
        .attr('height', function(d) { return height3 - y3(d.volume); });

    crowdsar.append('g')
        .attr('class', 'x axis crowdsar')
        .attr('transform', 'translate(0,' + height4 + ')')
        .call(xAxis4);

    crowdsar.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate('+ width + ',0)')
        .call(yAxis4)
    
    crowdsar.append('g')
        .attr('clip-path', 'url(#clipCrowdsar)')
      .selectAll('crowd')
        .data(fData)
      .enter().append('rect')
        .attr('class', 'bar crowdsar')
        .style('fill', 'red')
        .attr('x', function(d) { return x4(d.date); })
        .attr('width', 3)
        .attr('y', function(d) { return y4(d.close); })
        .attr('height', function(d) { return height4 - y4(d.close); });

    context.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height2 + ')')
        .call(xAxis2);

    context.append('g')
        .attr('class', 'x brush')
        .call(brush.extent([x2.domain()[1].setMonth(x2.domain()[1].getMonth() - 3), x2.domain()[1]]))
        .call(brush.event)
        .call(brush)
        .selectAll('rect')
        .attr('y', -6)
        .attr('height', height2 + 7);

    context.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('d', line2);

    function brushed(){
      x.domain(brush.empty() ? x2.domain() : brush.extent());
      svg.select('.line').attr('d', line);
      svg.select('.x.axis.focus').call(xAxis);
    
      x3.domain(brush.empty() ? x2.domain() : brush.extent());
      svg.selectAll('.bar.vol').attr("transform", function(d) { return "translate(" + x3(d.date) + ",0)"; });
      svg.select('.x.axis.volume').call(xAxis3);

      x4.domain(brush.empty() ? x2.domain() : brush.extent());
      svg.selectAll('.bar.crowdsar').attr("transform", function(d) { return "translate(" + x4(d.date) + ",0)"; });
      svg.select('.x.axis.crowdsar').call(xAxis4);

    }

    }
});

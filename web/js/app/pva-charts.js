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

    var brush = d3.svg.brush().x(x2).on("brush", brushed);

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

    var crowdsar = svg.append('g')
        .attr('class', 'crowd')
        .attr('transform', 'translate(' + margin4.left + ',' + margin4.top + ')');

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
        .attr('d', line);

    barGraph.append('g')
        .attr('class', 'x axis volume')
        .attr('transform', 'translate(0,' + height3 + ')')
        .call(xAxis3);

    barGraph.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate('+ width + ',0)')
        .call(yAxis3)

    barGraph.selectAll('bar')
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
    
    crowdsar.selectAll('crowd')
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
/*
    var margin = {top: 0, right: 50, bottom: 280, left: 20};
    var volumeObjMargin = {top: 250, right: 50, bottom: 190, left: 20};
    var crowdObjMargin = {top: 340, right: 50, bottom: 120, left: 20};
    var contextObjMargin = {top: 440, right: 50, bottom: 40, left: 20};

    var closeHeight = 500 - margin.top - margin.bottom;
    var volHeight = 500 - volumeObjMargin.top - volumeObjMargin.bottom;
    var crowdHeight = 500 - crowdObjMargin.top - crowdObjMargin.bottom;
    var contextHeight = 500 - contextObjMargin.top - contextObjMargin.bottom;

    var width   = Ember.$('#container-pvchart').width() - margin.left - margin.right;

    var parseDate = d3.time.format("%b-%y").parse;

    var xClose   = techan.scale.financetime().range([0, width]).outerPadding(0);
    var xVolume  = techan.scale.financetime().range([0, width]).outerPadding(0);
    var xCrowd   = techan.scale.financetime().range([0, width]).outerPadding(0);
    var xContext = techan.scale.financetime().range([0, width]).outerPadding(0);

    var yClose   = d3.scale.linear().range([closeHeight, 0]);
    var yVol     = d3.scale.linear().range([volHeight, 0]);
    var yCrowd   = d3.scale.linear().range([crowdHeight, 0]);
    var yContext = d3.scale.linear().range([contextHeight, 0]);

    var brush = d3.svg.brush()
                  .on("brushend", draw)

    var close = techan.plot.close()
            .xScale(xClose)
            .yScale(yClose)

    var volume = techan.plot.volume()
            .xScale(xVolume)
            .yScale(yVol);

    var crowd = techan.plot.volume()
            .xScale(xCrowd)
            .yScale(yCrowd);

    var context = techan.plot.close()
            .xScale(xContext)
            .yScale(yContext);
    
    var closeXAxis = d3.svg.axis()
            .scale(xClose)
            .tickFormat(d3.time.format('%b-%y'))
            .orient("bottom");

    var closeYAxis = d3.svg.axis()
            .scale(yClose)
            .orient("left");

    var volXAxis = d3.svg.axis()
            .scale(xVolume)
            .tickFormat(" ")
            .orient("bottom");

    var volFormat = d3.format(".2f");

    var volYAxis = d3.svg.axis()
            .scale(yVol)
            .ticks(4)
            .tickFormat(formatVolume)
            .orient("left");

    var crowdXAxis = d3.svg.axis()
            .scale(xCrowd)
            .orient("bottom");

    var crowdYAxis = d3.svg.axis()
            .scale(yCrowd)
            .orient("left");

    var contextXAxis = d3.svg.axis()
            .scale(xContext)
            .tickFormat(d3.time.format('%b-%y'))
            .orient("bottom");

    var contextYAxis = d3.svg.axis()
            .scale(yContext)
            .orient("left");
   
    var zoomBehavior = d3.behavior.zoom()
      .scaleExtent([0.2, 3])
      .on("zoom", draw);

    var svg = d3.select("#container-pvchart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", 500 + margin.top + margin.bottom)
            .call(zoomBehavior)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var coordsText = svg.append('text')
            .style("text-anchor", "end")
            .attr("class", "coords")
            .attr("x", width - 5)
            .attr("y", 15);

    var cAccessor = close.accessor();
    var vAccessor = volume.accessor();
    var sAccessor = crowd.accessor();
    var oAccessor = context.accessor()

    var priceAnnotation = techan.plot.axisannotation()
            .axis(closeYAxis)
            .format(d3.format(',.2fs'))
            .translate([width, margin.top]);

    var dateAnnotation = techan.plot.axisannotation()
            .axis(closeXAxis)
            .format(d3.time.format('%y-%m-%d'))
            .width(65)
            .translate([0, closeHeight]);

    var crosshair1 = techan.plot.crosshair()
            .xScale(xClose)
            .yScale(yClose)
            .xAnnotation(dateAnnotation)
            .yAnnotation(priceAnnotation)
            .on("enter", enter)
            .on("out", out);

    xClose.domain(data.map(cAccessor.d));
    xVolume.domain(data.map(vAccessor.d));
    xCrowd.domain(data.map(sAccessor.d));
    xContext.domain(data.map(oAccessor.d));
    
    yClose.domain(techan.scale.plot.ohlc(data, cAccessor).domain());
    yVol.domain(techan.scale.plot.volume(data, vAccessor).domain());
    yCrowd.domain(techan.scale.plot.volume(fData, sAccessor).domain());
    yContext.domain(techan.scale.plot.ohlc(data, oAccessor).domain());

    svg.append("svg:clipPath").attr("id", "closeClip")
                .append("svg:rect")
                    .attr("x", 0)
                    .attr("y", yClose(1))
                    .attr("width", width)
                    .attr("height", yClose(0) - yClose(1));
    
    svg.append("g").datum(data)
                   .attr("class", "close")
                   .attr("clip-path", "url(#closeClip)")
                   .call(close);

    svg.append("g").attr("class", "x axis")
                   .attr("transform", "translate(0," + closeHeight + ")")
                   .call(closeXAxis);

    svg.append("g").attr("class", "y annotation")
                   .datum([{value: 61}, {value:52}])
                   .call(priceAnnotation);

    svg.append("g").attr("class", "x annotation")
                   .datum([{value: 61}, {value:52}])
                   .call(dateAnnotation);

    svg.append('g').attr("class", "crosshair")
                   .call(crosshair1);

    svg.append("g").attr("class", "y axis")
                   .attr("transform", "translate(" + width + "," + margin.top + ")")
                   .call(closeYAxis)
                 .append("text")
                   .attr("transform", "rotate(-90)")
                   .attr("y", 6)
                   .attr("dy", ".71em")
                   .style("text-anchor", "end");

    svg.append("g").datum(data)
                   .attr("class", "volume")
                   .attr("clip-path", "url(#closeClip)")
                   .attr("transform", "translate(0, " + volumeObjMargin.top + ")")
                   .call(volume);

    svg.append("g").attr("class", "x axis vol")
                   .attr("transform", "translate(0, "  + (volumeObjMargin.top + volHeight) + ")")
                   .call(volXAxis);

    svg.append("g").attr("class", "y axis vol")
                   .attr("transform", "translate(" + width + "," + volumeObjMargin.top + ")")
                   .call(volYAxis)
                 .append("text")
                   .attr("transform", "rotate(-90)")
                   .attr("y", 6)
                   .attr("dy", ".21em")
                   .style("text-anchor", "end");

    svg.append("g").datum(fData)
                   .attr("class", "crowd")
                   .attr("clip-path", "url(#closeClip)")
                   .attr("transform", "translate(0, " + crowdObjMargin.top + ")")
                   .call(crowd);

    svg.append("g").attr("class", "x axis crowd")
                   .attr("transform", "translate(0, "  + (crowdObjMargin.top + crowdHeight) + ")")
                   .call(crowdXAxis);

    svg.append("g").attr("class", "y axis crowd")
                   .attr("transform", "translate(" + width + "," + crowdObjMargin.top + ")")
                   .call(crowdYAxis)
                 .append("text")
                   .attr("transform", "rotate(-90)")
                   .attr("y", 6)
                   .attr("dy", ".21em")
                   .style("text-anchor", "end");

    svg.append("g").datum(data)
                   .attr("class", "context")
                   .attr("transform", "translate(0, " + contextObjMargin.top + ")")
                   .call(context);

    svg.append("g").attr("class", "pane")
                   .attr("transform", "translate(0, " + contextObjMargin.top + ")");

    svg.append("g").attr("class", "x axis")
                   .attr("transform", "translate(0, "  + (contextObjMargin.top + contextHeight) + ")")
                   .call(contextXAxis);

    svg.append("g").attr("class", "y axis")
                   .attr("transform", "translate(" + width + " ," + contextObjMargin.top + ")")
                   .call(contextYAxis)
                 .append("text")
                   .attr("transform", "rotate(-90)")
                   .attr("y", 6)
                   .attr("dy", ".21em")
                   .style("text-anchor", "end");

    closeZoomable   = xClose.zoomable();
    volumeZoomable  = xVolume.zoomable();
    crowdZoomable   = xCrowd.zoomable();
    contextZoomable = xContext.zoomable();

    brush.x(contextZoomable);
    
    svg.select("g.pane").call(brush).selectAll("rect").attr("height", contextHeight);

    function enter() {
        coordsText.style("display", "inline");
    }

    function out() {
        coordsText.style("display", "none");
    }
    
    function draw() {
      var selection = svg.select("g.close");
      var data = selection.datum();
      
      closeZoomable.domain(brush.empty() ? contextZoomable.domain() : brush.extent());
      volumeZoomable.domain(brush.empty() ? contextZoomable.domain() : brush.extent());
      crowdZoomable.domain(brush.empty() ? contextZoomable.domain() : brush.extent());
      closeZoomable.domain(brush.empty() ? contextZoomable.domain() : brush.extent());

      yClose.domain(techan.scale.plot.ohlc(data.slice.apply(data, closeZoomable.domain()), close.accessor()).domain());

      selection.call(close);
      svg.select("g.x.axis").call(closeXAxis);
      svg.select("g.y.axis").call(closeYAxis);
      
      svg.select("g.volume").call(volume);
      svg.select("g.x.axis.vol").call(volXAxis);
      svg.select("g.y.axis.vol").call(volYAxis);
      
      svg.select("g.crowd").call(crowd);
      svg.select("g.x.axis.crowd").call(crowdXAxis);
      svg.select("g.y.axis.crowd").call(crowdYAxis);
    
    }
    
    function formatVolume(d) {
        return volFormat(d / 1e6);
    }
  }
});*/

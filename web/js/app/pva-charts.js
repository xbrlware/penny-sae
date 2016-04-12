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

    crowdObjMargin = {top: 330, right: 20, bottom: 110, left: 20};
    volumeObjMargin = {top: 230, right: 20, bottom: 190, left: 20};
    contextObjMargin = {top: 430, right: 20, bottom: 30, left: 20};

    var margin = {top: 10, right: 50, bottom: 300, left: 20};
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
            .yScale(yClose);

    var volume = techan.plot.volume()
            .xScale(xVolume)
            .yScale(yVol);

    var crowd = techan.plot.volume()
            .xScale(xCrowd)
            .yScale(yCrowd);

    var context = techan.plot.close()
            .xScale(xContext)
            .yScale(yContext)
    
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
            .ticks(2)
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
                       .ticks(4)
                       .orient("left");

    var contextXAxis = d3.svg.axis()
            .scale(xContext)
            .tickFormat(d3.time.format('%b-%y'))
            .orient("bottom");

    var contextYAxis = d3.svg.axis()
            .scale(yContext)
            .orient("left");

    var svg = d3.select("#container-pvchart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", 500 + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var coordsText = svg.append('text')
            .style("text-anchor", "end")
            .attr("class", "coords")
            .attr("x", width - 5)
            .attr("y", 15);

    var cAccessor = close.accessor();
    var vAccessor = volume.accessor();
    var sAccessor = volume.accessor();
    var oAccessor = close.accessor()

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

    svg.append("clipPath").attr("id", "closeClip")
                .append("rect")
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

    svg.append("g").attr("class", "close");

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
      svg.select("g.volume").call(volume);
      svg.select("g.crowd").call(crowd);

      svg.select("g.x.axis").call(closeXAxis);
      svg.select("g.y.axis").call(closeYAxis);

      svg.select("g.x.axis.vol").call(volXAxis);
      svg.select("g.y.axis.vol").call(volYAxis);
      
      svg.select("g.x.axis.crowd").call(crowdXAxis);
      svg.select("g.y.axis.crowd").call(crowdYAxis);
    
    }
    
    function formatVolume(d) {
        return volFormat(d / 1e6);
    }
  }
});

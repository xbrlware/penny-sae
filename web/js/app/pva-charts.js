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

    crowdObjMargin = {top: 330, right: 20, bottom: 110, left: 50};
    volumeObjMargin = {top: 230, right: 20, bottom: 190, left: 50};
  
    var margin = {top: 10, right: 20, bottom: 300, left: 50};
    var closeHeight = 500 - margin.top - margin.bottom;
    var volHeight = 500 - volumeObjMargin.top - volumeObjMargin.bottom;
    var crowdHeight = 500 - crowdObjMargin.top - crowdObjMargin.bottom;
    var width   = Ember.$('#container-pvchart').width() - margin.left - margin.right;

    var parseDate = d3.time.format("%d-%b-%y").parse;

    var x = techan.scale.financetime()
            .range([0, width])
            .outerPadding(0);

    var yClose = d3.scale.linear().range([closeHeight, 0]);
    var yVol   = d3.scale.linear().range([volHeight, 0]);
    var yCrowd = d3.scale.linear().range([crowdHeight, 0]);

    var crowd = techan.plot.volume()
                      .xScale(x)
                      .yScale(yCrowd);

    var close = techan.plot.close()
            .xScale(x)
            .yScale(yClose);

    var volume = techan.plot.volume()
            .xScale(x)
            .yScale(yVol);

    var crowd = techan.plot.volume()
                           .xScale(x)
                           .yScale(yCrowd);

    var closeXAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

    var closeYAxis = d3.svg.axis()
            .scale(yClose)
            .orient("left");

    var volXAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

    var volYAxis = d3.svg.axis()
            .scale(yVol)
            .orient("left");

    var crowdXAxis = d3.svg.axis()
                       .scale(x)
                       .orient("bottom")

    var crowdYAxis = d3.svg.axis()
                       .scale(yCrowd)
                       .orient("left")

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

    var priceAnnotation = techan.plot.axisannotation()
                                    .axis(closeYAxis)
                                    .format(d3.format(',.2fs'));

    var dateAnnotation = techan.plot.axisannotation()
            .axis(closeXAxis)
            .format(d3.time.format('%Y-%m-%d'))
            .width(65)
            .translate([0, closeHeight]);

    var crosshair = techan.plot.crosshair()
                               .xScale(x)
                               .yScale(yClose)
                               .xAnnotation(dateAnnotation)
                               .yAnnotation(priceAnnotation)
                               .on("enter", enter)
                               .on("out", out)

    x.domain(data.map(cAccessor.d));
    
    yClose.domain(techan.scale.plot.ohlc(data, cAccessor).domain());
    yVol.domain(techan.scale.plot.volume(data, vAccessor).domain());
    yCrowd.domain(techan.scale.plot.volume(fData, sAccessor).domain());

    svg.append("g").datum(data)
                   .attr("class", "close")
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
                   .call(crosshair);

    svg.append("g").attr("class", "y axis")
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

    svg.append("g").attr("class", "x axis")
                   .attr("transform", "translate(0, "  + (volumeObjMargin.top + volHeight) + ")")
                   .call(volXAxis);

    svg.append("g").attr("class", "y axis")
                   .attr("transform", "translate(0 ," + volumeObjMargin.top + ")")
                   .call(volYAxis)
                 .append("text")
                   .attr("transform", "rotate(-90)")
                   .attr("y", 6)
                   .attr("dy", ".21em")
                   .style("text-anchor", "end");

    svg.append("g").datum(fData)
                   .attr("class", "volume")
                   .attr("transform", "translate(0, " + crowdObjMargin.top + ")")
                   .call(crowd);

    svg.append("g").attr("class", "x axis")
                   .attr("transform", "translate(0, "  + (crowdObjMargin.top + crowdHeight) + ")")
                   .call(crowdXAxis);

    svg.append("g").attr("class", "y axis")
                   .attr("transform", "translate(0 ," + crowdObjMargin.top + ")")
                   .call(crowdYAxis)
                 .append("text")
                   .attr("transform", "rotate(-90)")
                   .attr("y", 6)
                   .attr("dy", ".21em")
                   .style("text-anchor", "end");

    function enter() {
        coordsText.style("display", "inline");
    }

    function out() {
        coordsText.style("display", "none");
    }
    
    function draw() {
      console.log("shit happens here");
    }

  }
});

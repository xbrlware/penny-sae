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
    var priceObj   = {};
    var brushObj = {};
    var volumeObj  = {};
    var data  = [];
    var fData = [];

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

    for (var i = 0; i < model.cs.date.length; i++) {
      fData.push({
        date: new Date(model.cs.date[i]),
        n_post   : model.cs.n_post[i],
        n_susp   : model.cs.n_susp[i],
        p_susp   : model.cs.p_susp[i] ,
        p_susp_lb: model.cs.p_susp_lb[i]});
    }

    console.log('data brother --> ', data);
    console.log('fdata sister --> ', fData);

    var margin  = {top: 10, right: 20, bottom: 300, left: 50};
    var width   = Ember.$('#container-pvchart').width() - margin.left - margin.right;
    var x = techan.scale.financetime().range([0, width]);
    var brush = d3.svg.brush().on("brushend", draw);
    var height = 500;
    var svg = d3.select("#container-pvchart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

    function initSVG(obj) {
      return svg.append("g").attr("class", obj.class)
            .attr("transform", "translate(" + obj.margin.left + "," + obj.margin.top + ")");
    }


    function addDays (currentDate, days) {
      var dat = new Date(currentDate);
      dat.setDate(dat.getDate() + days);
      return dat;
    }


    function getDates (dateRange) {
      var dateArray = [];
      var currentDate = dateRange[0];

      while (currentDate <= dateRange[1]) {
        dateArray.push(new Date (currentDate));
        currentDate = addDays(currentDate, 1);
      }

      return dateArray;
    }
    
    var dateRange = d3.extent(_.flatten([_.pluck(data, 'date'),
                                 _.pluck(fData, 'date')]));

    console.log('Range of dates --> ', dateRange);

    var dateSupport = getDates(dateRange);

    console.log('Supporting dates ---> ', dateSupport);

    priceObj.margin  = margin;
    brushObj.margin = {top: 330, right: 20, bottom: 110, left: 50};
    volumeObj.margin = {top: 230, right: 20, bottom: 190, left: 50};

    priceObj.method  = "close";
    brushObj.method  = "close";
    volumeObj.method = "volume";

    priceObj.width  = width;
    brushObj.width = width;
    volumeObj.width = width;
    
    priceObj.height  = height - priceObj.margin.top - priceObj.margin.bottom;
    brushObj.height = height - brushObj.margin.top - brushObj.margin.bottom;
    volumeObj.height = height - volumeObj.margin.top - volumeObj.margin.bottom;
    
    priceObj.x  = techan.scale.financetime().range([0, width]);
    brushObj.x = techan.scale.financetime().range([0, width]);
    volumeObj.x = techan.scale.financetime().range([0, width]);

    priceObj.x.domain(dateSupport);
    brushObj.x.domain(dateSupport);
    volumeObj.x.domain(dateSupport);
    
    priceObj.y  = d3.scale.linear().range([priceObj.height, 0]);
    brushObj.y = d3.scale.linear().range([brushObj.height, 0]);
    volumeObj.y = d3.scale.linear().range([volumeObj.height, 0]);
    
    volumeObj.yVolume = d3.scale.linear().range([volumeObj.y(0), volumeObj.y(0.3)]);

    priceObj.plot = techan.plot.close().xScale(priceObj.x).yScale(priceObj.y);
    brushObj.plot = techan.plot.close().xScale(brushObj.x).yScale(brushObj.y);
    volumeObj.plot = techan.plot.volume().xScale(volumeObj.x).yScale(volumeObj.yVolume);


    priceObj.xAxis = d3.svg.axis().scale(priceObj.x).orient("bottom");
    brushObj.xAxis = d3.svg.axis().scale(brushObj.x).orient("bottom");
    volumeObj.xAxis = d3.svg.axis().scale(volumeObj.x).orient("bottom");

    priceObj.yAxis  = d3.svg.axis().scale(priceObj.y).orient("left");
    brushObj.yAxis = d3.svg.axis().scale(brushObj.y).ticks(0).orient("left");
    volumeObj.yAxis = d3.svg.axis().scale(volumeObj.y).ticks(0).orient("left");

    priceObj.class  = 'price';
    brushObj.class = 'brush';
    volumeObj.class = 'volume';

    var ohlcAnnotation = techan.plot.axisannotation()
            .axis(priceObj.yAxis)
            .format(d3.format(',.2fs'));

    var timeAnnotation = techan.plot.axisannotation()
            .axis(priceObj.xAxis)
            .format(d3.time.format('%Y-%m-%d'))
            .width(65)
            .translate([0, priceObj.height]);

    var crosshair = techan.plot.crosshair()
            .xScale(priceObj.x)
            .yScale(priceObj.y)
            .xAnnotation(timeAnnotation)
            .yAnnotation(ohlcAnnotation);

    priceObj.svg  = initSVG(priceObj);
    brushObj.svg  = initSVG(brushObj);
    volumeObj.svg = initSVG(volumeObj);

    priceObj.svg.append("clipPath")
                    .attr("id", "clip");
    priceObj.svg.append("rect")
                    .attr("x", 0)
                    .attr("y", priceObj.y(1))
                    .attr("width", priceObj.width)
                    .attr("height", priceObj.y(0) - priceObj.y(1));
    priceObj.svg.append("g")
                    .attr("class", priceObj.method)
                    .attr("clip-path", "url(#clip)");
    priceObj.svg.append("g")
                    .attr("class", "y axis");
    priceObj.svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Price");
    priceObj.svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + priceObj.height + ")");
    priceObj.svg.append('g')
                    .attr("class", "crosshair")
                    .call(crosshair);
          
    volumeObj.svg.append("clipPath")
                    .attr("id", "clip");
    volumeObj.svg.append("rect")
                    .attr("x", 0)
                    .attr("y", volumeObj.y(1))
                    .attr("width", volumeObj.width)
                    .attr("height", volumeObj.y(0) - volumeObj.y(1));
    volumeObj.svg.append("g")
                    .attr("class", volumeObj.method)
                    .attr("clip-path", "url(#clip)");
    volumeObj.svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + volumeObj.height + ")");
    volumeObj.svg.append("g")
                    .attr("class", "y axis")
                    .call(volumeObj.yAxis);
    volumeObj.svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Vol");
    
    brushObj.svg.append("g")
                .attr("class", brushObj.method);
    brushObj.svg.append("g")
                .attr("class", "pane");
    brushObj.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + brushObj.height + ")");
    brushObj.svg.append("g")
                .attr("class", "y axis")
                .call(brushObj.yAxis);

    var zoomable, zoomable2;

    priceObj.y.domain(techan.scale.plot.ohlc(data).domain());
    brushObj.y.domain(brushObj.y.domain());
    volumeObj.y.domain(techan.scale.plot.volume(data).domain());

    volumeObj.yVolume.domain(techan.scale.plot.volume(data).domain());

    priceObj.svg.select("g.price").datum(data);

    volumeObj.svg.select("g.volume").datum(data);
     
    brushObj.svg.select("g.close").datum(data).call(brushObj.plot);
    brushObj.svg.select("g.x.axis") // .call(brushObj.xAxis);

    // Associate the brush with the scale and render the brush only AFTER a domain has been applied
    zoomable = priceObj.x.zoomable();
    zoomable2 = brushObj.x.zoomable();

    brush.x(zoomable2);

    brushObj.svg.select("g.pane").call(brush).selectAll("rect").attr("height", brushObj.height);

    draw();
    
    function _draw(obj, date_filter) {
      var data = obj.svg.select('g.' + obj.class).datum(data);

      var _data = _.filter(data, function(d) {
        return d.date > date_filter[0] & d.date < date_filter[1];
      });

      if(_data.length > 0) {
        obj.y.domain(techan.scale.plot[obj.method](_data).domain());
      } else {
        obj.y.domain([0, 1]);
      }

      // plot the data
      obj.svg.select("g." + obj.class).call(obj.plot);
      // draw the x / y axis for c2
      obj.svg.select("g.x.axis").call(obj.xAxis);
      obj.svg.select("g.y.axis").call(obj.yAxis);
    }

    function draw() {
      var brushDomain = brush.empty() ? zoomable2.domain() : brush.extent();
      var date_filter = d3.extent(dateSupport.slice.apply(dateSupport, brushDomain));
      zoomable.domain(brushDomain);
      _draw(priceObj, date_filter);
      _draw(volumeObj, date_filter);

    }   
  }
});

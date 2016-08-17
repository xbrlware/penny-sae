/* global Ember, App, d3, _, crossfilter, sessionStorage, gconfig */

App.BoardController = Ember.Controller.extend({
  needs: ['application', 'detail'],
  name: Ember.computed.alias('controllers.detail.model'),
  routeName: undefined,
  selection_ids: undefined,
  topX: undefined,
  isLoading: false,
  isData: true,
  timelineLoading: false,
  pageCount: 1,
  ascDesc: {},
  searchTerm: '',
  sentiment: 'neut',
  dateFilter: [new Date(gconfig.DEFAULT_DATE_FILTER[0]), new Date(gconfig.DEFAULT_DATE_FILTER[1])],
  defaultAscDesc: function () {
    /* sets default value for filter buttons - checks sessionStorage in browser first */
    var ss = {doc: 'desc', pos: 'desc', neg: 'desc', neut: 'desc', mean: 'desc', max: 'desc', type: 'doc'};
    if (typeof Storage !== 'undefined') {
      if (sessionStorage.pennyFilters) {
        var t = JSON.parse(sessionStorage.pennyFilters);
        ss[t.type] = t[t.type];
        ss.type = t.type;
      }
    }
    console.log('SS ::', ss);
    this.set('ascDesc', ss);
  },

  routeName_pretty: function () {
    /* returns a just the route name */
    var rn = this.get('routeName');
    return rn.charAt(0).toUpperCase() + rn.substr(1).toLowerCase();
  }.property(),

  splitByFilter: function () {
    /* Field names for "splitting" entity (i.e. the user if board, board if user) */
    return [];
  }.property(),

  dateDiff: function (startDate, endDate) {
    /* gets amount of days between start and end - used for bar width in charts */
    // Does not take daylight savings in account
    var oneDay = 24 * 60 * 60 * 1000;
    var firstDate = new Date(startDate);
    var secondDate = new Date(endDate);

    return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
  },

  makeDiv: function (obj, clip, svg) {
    /* builds generic 'g' tag for each chart */
    /* obj = chart object from above, clip = name of clip path */
    var div = svg.append('g').attr('class', 'focus1').attr('id', obj.class)
      .attr('transform',
          'translate(' + obj.position_left + ',' + obj.position_top + ')');

    // define clip path
    div.append('defs').append('clipPath')
      .attr('id', clip)
      .append('rect')
      .attr('x', 0)
      .attr('y', obj.y(1))
      .attr('width', obj.width)
      .attr('height', obj.y(0) - obj.y(1));

    // set clip path
    div.append('g')
      .attr('class', obj.class)
      .attr('clip-path', 'url(#' + clip + ')');

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

  makeBarChart: function (svg, chartObj, data, dateFilter) {
    if (!chartObj.div) {
      chartObj.div = this.makeDiv(chartObj, chartObj.clip, svg);
      chartObj.div.select('g.' + chartObj.class).datum(data);
    }

    var _data = _.filter(data, function (x) {
      return x.date > dateFilter[0] & x.date < dateFilter[1];
    });

    chartObj.x.domain(dateFilter);
    chartObj.y.domain(d3.extent(_data, function (d) { return d.volume; }));

    chartObj.div.selectAll('.bar').remove();

    var dd = this.dateDiff(chartObj.x.domain()[0], chartObj.x.domain()[1]);
    var barWidth = chartObj.width / dd;

    chartObj.div.selectAll('.bar')
      .data(_data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', function (d) { return chartObj.x(d.date); })
      .attr('width', barWidth)
      .attr('y', function (d) { return chartObj.y(d.volume); })
      .attr('height', function (d) { return chartObj.height - chartObj.y(d.volume); });

    // draw the axis
    chartObj.div.select('g.x.axis').call(chartObj.xAxis);
    chartObj.div.selectAll('g.y.axis').call(chartObj.yAxis);

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

  makeClose: function (svg, chartObj, data, dateFilter) {
    /* handles drawing each close chart */
    if (!chartObj.div) {
      chartObj.div = this.makeDiv(chartObj, chartObj.clip, svg);
      chartObj.div.select('g.' + chartObj.class).datum(data);
    }

    chartObj.x.domain(d3.extent(data, function (d) { return d.date; }));
    chartObj.y.domain(d3.extent(data, function (d) { return d.close; }));

    var _data = _.filter(data, function (d) {
      return d.date > dateFilter[0] & d.date < dateFilter[1];
    });

    chartObj.x.domain(dateFilter);

    // only for price object
    chartObj.y.domain(d3.extent(_data, function (d) { return d.close; }));
    chartObj.div.selectAll('.dot').remove();
    chartObj.div.selectAll('.line').remove();

    var line = d3.svg.line()
      .x(function (d) { return chartObj.x(d.date); })
      .y(function (d) { return chartObj.y(d.close); });

    chartObj.div.select('g.' + chartObj.class).append('path')
      .datum(_data)
      .attr('class', 'line')
      .attr('d', line);

    // overlays dots so d3 tip works
    chartObj.div.selectAll('.dot')
      .data(_data)
      .enter().append('circle')
        .attr('class', 'dot')
        .attr('opacity', '0.0')
        .attr('r', 3)
        .attr('cx', function (d) { return chartObj.x(d.date); })
        .attr('cy', function (d) { return chartObj.y(d.close); })
        .on('mouseover', chartObj.tip.show)
        .on('mouseout', chartObj.tip.hide);

    chartObj.div.call(chartObj.tip);
    // draw the axis
    chartObj.div.select('g.x.axis').call(chartObj.xAxis);
    chartObj.div.selectAll('g.y.axis').call(chartObj.yAxis);
  },

  makeTimeSeries: function (ts, bounds) {
    /* Builds time series for users using D3 */
    var _this = this;
    var div = '#ts-' + ts.id;
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

    d3.selectAll('g.y.axis.timeline g.tick text')
      .on('click', function (d, i) {
        if (i % 2 === 0) {
          _this.sortTimelines('mean');
        } else {
          _this.sortTimelines('max');
        }
      });

    svg.call(tip);
  },

  postFilteredData: function () {
    /* populates forum posts with data from filtered_data */
    /* watches these properties: filtered_data, dateFilter, pageCount */
    var data = this.get('filtered_data');
    var sbf = this.get('splitByFilter');
    var dfl = this.get('dateFilter');
    var pgc = this.get('pageCount');

    // filter dates
    var _data = dfl.length ? _.filter(data, function (d) {
      return d.date > dfl[0] & d.date < dfl[1];
    }) : data;

    // make sure that only the users we want are included
    var out = sbf.length ? _.filter(_data, function (d) {
      return _.contains(sbf, d.user_id);
    }) : _data;

    // only send out 100 forum messages at a time for lazy loading
    var r = (100 * pgc) < out.length ? _.chain(out).filter(function (x, i) {
      return i < (100 * pgc);
    }).value() : out;

    return r;
  }.property('filtered_data', 'dateFilter', 'pageCount'),

  redraw: function (numPosters = 10) {
    /* redraw time lines and forum messages */
    /* numPosters is used by size in the ES query */
    var _this = this;
    var data = {
      cik: this.controllerFor('detail').get('model.cik'),
      date_filter: this.get('dateFilter'),
      search_term: this.get('searchTerm'),
      sentiment: {type: this.get('sentiment'), score: 0.5},
      size: numPosters
    };

    // set spinner
    this.set('timelineLoading', true);

    // call to ES
    App.Search.fetch_data('redraw', data).then(function (response) {
      _this.set('splitByFilter', []);
      _this.set('pageCount', 1);
      _this.set('model.tlData', response.tlData);
      _this.set('model.data', response.data);
      _this.set('filtered_data', _.map(response.data, function (x) {
        x.date = new Date(x.date);
        return x;
      }));
      // render everything
      _this.renderX();
      _this.renderGauges();

      Ember.run.next(function () {
        // sets which filter buttons are colored as active
        var a = _this.get('ascDesc').type;
        var b = _this.get('ascDesc')[a];
        var c = a === 'pos' || a === 'neut' || a === 'neg' ? '.sentiment' : '.numposts';
        var d = 'ascDesc.' + a;
        _this.set(d, b === 'asc' ? 'desc' : 'asc');
        _this.setFilterDecoration(a, c);

        Ember.$('.forum-div').scroll(function () {
          if (Ember.$('.forum-div').scrollTop() + Ember.$('.forum-div').height() >= Ember.$('.forum-div')[0].scrollHeight) {
            var pgc = _this.get('pageCount');
            if (pgc < 10) {
              pgc++;
              _this.set('pageCount', pgc);
            }
          }
        });
      });
      // stop spinner
      _this.set('timelineLoading', false);
    });
  },

  draw: function () {
    /* main draw function for all charts */
    /* fires when there are changes in the model */
    var _this = this;
    var data = this.get('model.ptData');
    var pvData = this.get('model.pvData');

    var forumData = _.map(data, function (x) {
      return { 'date': new Date(x.date), 'volume': x.value };
    });

    // For parent filter
    var datum = crossfilter(forumData);

    var date = datum.dimension(function (d) {
      return d.date;
    });

    // Whenever the brush moves, re-rendering everything.
    var renderAll = function (_this) {
      // Time series
      var topX = _.pluck(data, 'id');
      _this.set('topX', topX);
      _this.redraw();
    };

    this.renderCharts(forumData, pvData, '#time-chart',
      function (dateFilter) {
        _this.set('dateFilter', dateFilter);
        date.filterRange(dateFilter);
        renderAll(_this);
      }
    );
  },

  toggleSplitByFilterMember(id) {
    /* toggles which users are seen in the forum messages */
    var xFilter = this.get('splitByFilter');

    if (_.contains(xFilter, id)) {
      this.set('splitByFilter', _.without(xFilter, id));
    } else {
      this.set('splitByFilter', _.union(xFilter, [id]));
    }
  },

  renderX() {
    /* sets up data and then uses makeTimeSeries to draw all
     * users and their timelines
     */
    var _this = this;
    var model = this.get('model.tlData');
    var ascDesc = this.get('ascDesc');

    // in order of ascending or descending
    if (ascDesc[ascDesc.type] === 'asc') {
      model = _.sortBy(model, ascDesc.type === 'doc' ? 'doc_count' : ascDesc.type);
    } else {
      model = _.sortBy(model, ascDesc.type === 'doc' ? 'doc_count' : ascDesc.type).reverse();
    }

    // set up x axis
    var dateFilter = this.get('dateFilter');

    var xmin = dateFilter ? dateFilter[0] : _.chain(model.timeline).pluck('key_as_string').map(function (x) {
      return new Date(x);
    }).min().value();

    var xmax = dateFilter ? dateFilter[1] : _.chain(model.timeline).pluck('key_as_string').map(function (x) {
      return new Date(x);
    }).max().value();

    // set up time line object to be passed to makeTimeSeries
    var topx = [];
    var timeseries = _.chain(model).map(function (v) {
      topx.push(v.id);
      return {
        'id': v.id,
        'name': v.user,
        'count': {
          'during': _.reduce(v.timeline, function (x, y) {
            return x + y.doc_count;
          }, 0),
          'before': 0,
          'after': 0
        },
        'timeseries': _.map(v.timeline, function (x) {
          return {date: new Date(x.key_as_string), value: x.doc_count};
        }),
        'max': v.max,
        'mean': v.mean,
        'min': v.min
      };
    }).value();

    // set topX which is used by the HB template
    this.set('topX', topx);

    // make time series
    Ember.run.next(function () {
      _.map(timeseries, function (t) {
        _this.makeTimeSeries(t, {
          'xmin': xmin,
          'xmax': xmax,
          'ymax': t.max,
          'ymin': 0
        });
      });
    });
  },

  renderGauges() {
    /* loads data used for drawing gauges and then passes that data to drawGauge */
    var _this = this;
    var data = this.get('model.tlData');

    Ember.run.next(function () {
      _.map(data, function (x) {
        return _this.drawGauge('#gauge-' + x.id, x.pred_data);
      });
    });
  }, // This should really be broken apart

  drawGauge(bindTo, gaugeData) {
    /* handles drawing a single gauge using D3 */
    d3.select(bindTo).selectAll('svg').remove();
    var _this = this;
    var data = gaugeData;

    var w = gconfig.GAUGE.SIZE.WIDTH;
    var h = gconfig.GAUGE.SIZE.HEIGHT / 2;
    var c = gconfig.GAUGE.COLOR_PATT;

    var r = w / 2;
    var ir = w / 4;
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
      .on('mouseout', tip.hide)
      .on('click', function (d) {
        d3.selectAll('.d3-tip').remove();
        // sort gauges
        _this.sortTimelines(d.data.label);
      });

    arcs.append('svg:path')
      .attr('fill', function (d, i) { return color[d.data.label]; })
      .attr('d', arc);

    return arcs;
  },

  renderCharts: function (forumData, pvdata, div, cb) {
    /* renders Post Volume, Brush, Price, and Trading Volume charts */
    var _this = this;
    // date formatting functions
    var parseDate = d3.time.format('%Y-%m-%d').parse;
    var parseDateTip = d3.time.format('%b-%d');

    // set up measuremeants for svg that holds all the charts
    var margin = { top: 20, bottom: 10, between: { y: 40, x: 40 }, left: 35, right: 5 };
    var totalHeight = 400 - margin.top - margin.between.y - margin.bottom;
    var totalWidth = Ember.$('#techan-wrapper').width() - margin.left - margin.right;

    // get price/volume data and parse it
    var pvData = _.chain(pvdata).map(function (d) {
      return {
        date: parseDate(d.date),
        open: +d.open,
        high: +d.high,
        low: +d.low,
        close: +d.close,
        volume: +d.volume
      };
    }).value();

    // post volume
    var posts = {};
    posts.title = 'Post Volume';
    posts.class = 'volume-posts';
    posts.clip = 'c1';
    posts.width = totalWidth * 0.5;
    posts.height = totalHeight * 0.8 - 0.5 * margin.between.y;
    posts.position_left = margin.left;
    posts.position_top = margin.top;
    posts.x = d3.time.scale().range([0, posts.width]);
    posts.y = d3.scale.linear().range([posts.height, 0]);
    posts.xAxis = d3.svg.axis().scale(posts.x).ticks(4).orient('bottom').tickFormat(d3.time.format('%m-%Y'));
    posts.yAxis = d3.svg.axis().scale(posts.y).orient('left').ticks(4).tickFormat(d3.format('s'));
    posts.tip = d3.tip().attr('class', 'techan-tip').offset([-10, -2]).html(function (d) {
      return '<center><span>' + parseDateTip(d.date) + '</span><br /><span>' + d.volume + '</span></center>';
    });

    // brush chart
    var brushChart = {};
    brushChart.title = '';
    brushChart.class = 'brush-chart-posts';
    brushChart.clip = 'c2';
    brushChart.width = totalWidth * 0.5;
    brushChart.height = totalHeight * 0.2 - 0.5 * margin.between.y;
    brushChart.position_left = margin.left;
    brushChart.position_top = totalHeight * 0.8 + margin.between.y;
    brushChart.x = d3.time.scale().range([0, brushChart.width]);
    brushChart.y = d3.scale.linear().range([brushChart.height, 0]);
    brushChart.xAxis = d3.svg.axis().scale(brushChart.x).ticks(4).orient('bottom');
    brushChart.yAxis = d3.svg.axis().scale(brushChart.y).ticks(0).orient('left');
    brushChart.brush = d3.svg.brush().x(brushChart.x).on('brushend', rtDraw);

    // price chart
    var price = {};
    price.title = 'Price';
    price.class = 'close';
    price.clip = 'c3';
    price.width = totalWidth * 0.5 - 2 * margin.between.x - 20;
    price.height = totalHeight * 0.5 - 0.5 * margin.between.y;
    price.position_left = totalWidth * 0.5 + 2 * margin.between.x;
    price.position_top = margin.top;
    price.x = d3.time.scale().range([0, price.width]);
    price.y = d3.scale.linear().range([price.height, 0]);
    price.xAxis = d3.svg.axis().scale(price.x).ticks(4).orient('bottom').tickFormat(d3.time.format('%m-%Y'));
    price.yAxis = d3.svg.axis().scale(price.y).orient('left').ticks(4);
    price.tip = d3.tip().attr('class', 'techan-tip').offset([-10, -2]).html(function (d) {
      return '<center><span>' + parseDateTip(d.date) + '</span><br /><span>Open: ' + d.open + '</span><br /><span>Close: ' + d.close + '</span><br /><span>High: ' + d.high + '</span><br /><span>Low: ' + d.low + '</span></center>';
    });

    // trading volume chart
    var volume = {};
    volume.title = 'Volume';
    volume.class = 'volume';
    volume.clip = 'c4';
    volume.width = totalWidth * 0.5 - 2 * margin.between.x - 20;
    volume.height = totalHeight * 0.5 - 0.5 * margin.between.y;
    volume.position_left = totalWidth * 0.5 + 2 * margin.between.x;
    volume.position_top = totalHeight * 0.5 + margin.between.y;
    volume.x = d3.time.scale().range([0, volume.width]);
    volume.y = d3.scale.linear().range([volume.height, 0]);
    volume.xAxis = d3.svg.axis().scale(volume.x).ticks(4).orient('bottom').tickFormat(d3.time.format('%m-%Y'));
    volume.yAxis = d3.svg.axis().scale(volume.y).orient('left').ticks(4).tickFormat(d3.format('s'));
    // init D3 tip that is activated when you hover over charts
    volume.tip = d3.tip().attr('class', 'techan-tip').offset([-10, -2]).html(function (d) {
      return '<center><span>' + parseDateTip(d.date) + '</span><br /><span>' + d.volume + '</span></center>';
    });

    // init svg tree
    d3.select(div).select('svg').remove();
    var svg = d3.select(div).append('svg')
      .attr('width', totalWidth + margin.left + margin.between.x + margin.right)
      .attr('height', totalHeight + margin.top + margin.between.y + margin.bottom);

    function rtDraw () {
      /* fired during init and when the brush moves */
      var brushDomain = brushChart.brush.empty() ? price.x.domain() : brushChart.brush.extent();

      _this.makeBarChart(svg, posts, forumData, brushDomain);
      _this.makeClose(svg, price, pvData, brushDomain);
      _this.makeBarChart(svg, volume, pvData, brushDomain);

      console.log('this ::', _this);
      cb(brushDomain);
    }

    // draw brush chart
    this.makeBarChart(svg, brushChart, forumData, [new Date('2004-01-01'), new Date()]);
    // set inital date ranges to be shown
    brushChart.brush.extent(d3.extent(forumData, function (d) { return d.date; }));
    brushChart.brush(d3.select('.brush').transition());
    rtDraw();
  },

  sortPosters: function (sortType) {
    /* sets variables and lets renderX and renderGauges render by sort type */
    var ascdesc = this.get('ascDesc');

    ascdesc[sortType] = ascdesc[sortType] === 'asc' ? 'desc' : 'asc';
    ascdesc.type = sortType;

    this.set('ascDesc', ascdesc);
    sessionStorage.pennyFilters = JSON.stringify(ascdesc);

    this.set('splitByFilter', []);

    this.renderX();
    this.renderGauges();
  },

  setFilterDecoration: function (sortType, chevronClass) {
    /* activates/deactivates the right buttons and FA chevrons */
    var ad = this.get('ascDesc')[sortType];

    Ember.$('.btn-xs').removeClass('active');
    Ember.$('.btn-round-xs').removeClass('active');
    Ember.$('.filter-' + sortType).toggleClass('active');

    if (ad === 'asc') {
      if (Ember.$(chevronClass).hasClass('fa-chevron-up')) {
        Ember.$(chevronClass).removeClass('fa-chevron-up');
        Ember.$(chevronClass).toggleClass('fa-chevron-down');
      }
    } else {
      if (Ember.$(chevronClass).hasClass('fa-chevron-down')) {
        Ember.$(chevronClass).removeClass('fa-chevron-down');
        Ember.$(chevronClass).toggleClass('fa-chevron-up');
      }
    }
  },

  sortTimelines: function (st) {
    /* high level sorting function */
    var c = st === 'pos' || st === 'neut' || st === 'neg' ? '.sentiment' : '.numposts';
    this.setFilterDecoration(st, c);
    this.sortPosters(st);
  },

  toggleSentiment: function (st) {
    var _this = this;
    var cik = this.controllerFor('detail').get('model.cik');
    App.Search.fetch_data('cik2name', {'cik': cik}).then(function (cData) {
      App.Search.fetch_data('board', {'cik': cik, 'ticker': cData.ticker, 'date_filter': _this.get('dateFilter'), 'sentiment': {type: st, score: 0.5}}).then(function (response) {
        _this.set('model', response);
        console.log('model ::', response);
        _this.set('filtered_data', _.map(response.data, function (x) {
          x.date = new Date(x.date);
          return x;
        }));
        if (!response.pvData.length && !response.data.length) { _this.set('isData', false); }
        _this.draw();
      });
    });
  },

  actions: {
    toggleVolume: function (sentiment) {
      this.set('sentiment', sentiment);
      this.toggleSentiment(sentiment);
    },

    numPosters: function (num) {
      /* handles when user changes number of time lines to be displayed */
      if (!isNaN(num)) {
        this.redraw(Number(num) < 1 ? 1 : Number(num));
      }
    },

    sortUsers: function (sortType) {
      /* handles high level sorting of time lines */
      this.sortTimelines(sortType);
    },

    ascdesc: function (btn) {
      /* handles when sentiment and posts filter buttons are pressed */
      var a = Ember.$('.btn.active').text().replace(/\n/g, '') === 'num' ? 'doc' : Ember.$('.btn.active').text().replace(/\n/g, '');

      if (btn === 'sentiment') {
        if (a === 'doc' || a === 'max' || a === 'min') {
          a = 'pos';
        }
      } else {
        if (a === 'pos' || a === 'neut' || a === 'neg') {
          a = 'doc';
        }
      }
      this.sortTimelines(a);
    },

    topXClicked(id) {
      /* handles when user is clicked on */
      var _this = this;
      this.set('pageCount', 1);
      Ember.$('#ts-' + id).toggleClass('chart-selected');
      var cik = this.controllerFor('detail').get('model.cik');
      this.toggleSplitByFilterMember(id);

      if (this.get('splitByFilter').length) {
        App.Search.fetch_data('user', {cik: cik, users: this.get('splitByFilter'), date_filter: this.get('dateFilter'), search_term: this.get('searchTerm'), sentiment: {type: _this.get('sentiment'), score: 0.5}}).then(function (response) {
          _this.set('filtered_data', _.map(response, function (x) {
            x.date = new Date(x.date);
            return x;
          }));
        });
      } else {
        this.set('filtered_data', this.get('model.data'));
      }
    },

    messageSearch: function (searchTerm) {
      /* high level function for searching messages for string */
      this.set('searchTerm', searchTerm);
      this.redraw();
    }
  }
});

App.BoardRoute = Ember.Route.extend({
  /* only used for setting up controller and loading initial data */
  setupController: function (con, model, params) {
    con.set('isLoading', true);
    con.set('filtered_data', []);
    con.set('isData', true);
    con.set('searchTerm', '');
    con.set('sentiment', 'neut');

    // set poster sort object this.ascDesc
    con.defaultAscDesc();

    var cik = this.controllerFor('detail').get('model.cik');
    App.Search.fetch_data('cik2name', {'cik': cik}).then(function (cData) {
      App.Search.fetch_data('board', {'cik': cik, 'ticker': cData.ticker, 'date_filter': con.get('dateFilter'), 'sentiment': {type: 'neut', score: 0.5}}).then(function (response) {
        con.set('model', response);
        con.draw();
        console.log('model ::', response);
        con.set('filtered_data', _.map(response.data, function (x) {
          x.date = new Date(x.date);
          return x;
        }));
        con.set('splitByFilter', []);
        con.set('pageCount', 1);
        con.set('routeName', 'board');
        con.set('selection_ids', params.params[con.get('routeName')].ids);
        con.set(con.get('routeName') + '_filter', params.params[con.get('routeName')].ids);
        con.set('isLoading', false);

        if (!response.pvData.length && !response.data.length) { con.set('isData', false); }
      });
    });
  }
});

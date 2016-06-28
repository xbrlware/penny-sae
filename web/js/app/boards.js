/* global Ember, App, d3, _, techan, crossfilter, gconfig */

function makeTimeSeries (ts, bounds) {
  var div = '#ts-' + ts.id;
  var margin = {top: 10, right: 15, bottom: 20, left: 20};
  var FILL_COLOR = 'orange';
  var TEXT_COLOR = '#ccc';

  // Calculate bar width
  var BAR_WIDTH = 2;

  var data = _.chain(ts.timeseries).map(function (x) {
    return {
      'date': new Date(x.key),
      'value': +x.value
    };
  }).value();

  var parseDate = d3.time.format('%b-%d');

  // Clear previous values
  d3.select(div).selectAll('svg').remove();

  d3.select(div + ' .title').text(ts.name);
  d3.select(div + ' .during').html('<span>Num. Posts: ' + ts.count.during + '</span>');

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-5, 0])
    .html(function (d) {
      return '<center><span>' + parseDate(d.date) + '</span><br /><span>' + d.value + '</span></center>';
    });

  // Get cell height
  var height = (margin.top + margin.bottom) * 1.5;
  var width = (Ember.$('#techan-wrapper').width() * 0.4) - (margin.left + margin.right);

  var x = d3.time.scale().range([0, width - (margin.left + margin.right)]);
  x.domain(d3.extent([bounds.xmin, bounds.xmax])).nice();

  var y = d3.scale.linear().range([height, 0]);
  y.domain([0, bounds.ymax]);

  var svg = d3.select(div).append('svg:svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var xaxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(2)
    .tickFormat(d3.time.format('%b-%y'));

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xaxis)
    .attr('stroke', TEXT_COLOR);

  svg.selectAll('bar')
    .data(data)
    .enter().append('rect')
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
    .style('fill', FILL_COLOR)
    .attr('x', function (d) { return x(d.date); })
    .attr('width', BAR_WIDTH)
    .attr('y', function (d) { return y(d.value); })
    .attr('height', function (d) { return height - y(d.value); });

  svg.call(tip);
}

App.BoardController = Ember.Controller.extend({
  needs: ['application', 'detail'],
  name: Ember.computed.alias('controllers.detail.model'),
  routeName: undefined,
  selection_ids: undefined,
  topX: undefined,
  isLoading: false,
  isData: true,
  timelineLoading: false,
  dateFilter: [new Date(gconfig.DEFAULT_DATE_FILTER[0]), new Date(gconfig.DEFAULT_DATE_FILTER[1])],
  routeName_pretty: function () {
    var rn = this.get('routeName');
    return rn.charAt(0).toUpperCase() + rn.substr(1).toLowerCase();
  }.property(),

  // Field names for "splitting" entity (i.e. the user if board, board if user)
  splitByFilter: function () {
    return [];
  }.property(),

  postFilteredData: function () {
    var xId = this.get('splitById');
    var data = this.get('filtered_data');
    var sbf = this.get('splitByFilter');
    var dfl = this.get('dateFilter');

    var out;
    var _data;

    if (dfl.length) {
      _data = _.filter(data, function (d) {
        return d.date > dfl[0] & d.date < dfl[1];
      });
    } else {
      _data = data;
    }

    if (sbf.length > 0) {
      out = _.filter(_data, function (x) {
        return _.contains(sbf, x[xId]);
      });
    } else {
      out = _data;
    }

    var r = _.chain(out).filter(function (x, i) {
      return i < 100;
    }).value();

    return r;
  }.property('filtered_data', 'dateFilter'),

  splitBy: function () {
    return 'user';
  }.property(),

  splitById: function () {
    return this.get('splitBy') + '_id';
  }.property(),

  redraw: function () {
    var _this = this;
    var cik = _this.controllerFor('detail').get('model.cik');
    this.set('timelineLoading', true);

    App.Search.fetch_data('cik2name', {'cik': cik}).then(function (cData) {
      App.Search.fetch_data('redraw', {ticker: cData.ticker, date_filter: _this.get('dateFilter')}).then(function (response) {
        _this.set('model.tlData', response);
        _this.renderX();
        _this.renderGauges();
        _this.set('timelineLoading', false);
      });
    });
  },

  draw: function () {
    var _this = this;
    var data = this.get('model.ptData');
    var pvData = this.get('model.pvData');
    data.forEach(function (d, i) {
      d.index = i;
      d.date = new Date(d.key_as_string);
      d.value = d.doc_count;
    });

    // For parent filter
    var datum = crossfilter(data);

    var date = datum.dimension(function (d) {
      return d.date;
    });

    var forumData = _.map(data, function (x) {
      return { 'date': x.date, 'volume': x.value };
    });

    // Whenever the brush moves, re-rendering everything.
    var renderAll = function (_this) {
      if (_this.get('topX') === undefined) {
        // Time series
        var topX = _.pluck(data, 'id');
        _this.set('topX', topX);
        _this.renderX();
        _this.renderGauges();
      } else {
        _this.redraw();
      }
    };

    this.renderTechan(forumData, pvData, this.get('routeName'), this.get('selection_ids'), '#time-chart',
      function (dateFilter) {
        _this.set('dateFilter', dateFilter);
        date.filterRange(dateFilter);
        renderAll(_this);
      }
    );

  // renderAll(_this)
  }.observes('model'),

  toggleSplitByFilterMember (id) {
    var xFilter = this.get('splitByFilter');

    if (_.contains(xFilter, id)) {
      this.set('splitByFilter', _.without(xFilter, id));
    } else {
      this.set('splitByFilter', _.union(xFilter, [id]));
    }
  },

  renderX () {
    var model = this.get('model.tlData');

    var dateFilter = this.get('dateFilter');

    var xmin = dateFilter ? dateFilter[0] : _.chain(model.timeline).pluck('key_as_string').map(function (x) {
      return new Date(x);
    }).min().value();

    var xmax = dateFilter ? dateFilter[1] : _.chain(model.timeline).pluck('key_as_string').map(function (x) {
      return new Date(x);
    }).max().value();

    var roundingFunction = (xmin - xmax) < (86400000 * 30) ? d3.time.hour : d3.time.day;

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
          return {key: roundingFunction(new Date(x.key_as_string)), value: x.doc_count};
        })
      };
    }).value();

    this.set('topX', topx);

    // Is this redundant?
    var flatVals = _.chain(timeseries).pluck('timeseries').flatten().value();
    var ymax = _.chain(flatVals).pluck('value').max().value();

    Ember.run.next(function () {
      _.map(timeseries, function (t) {
        makeTimeSeries(t, {
          'xmin': xmin,
          'xmax': xmax,
          'ymax': ymax,
          'ymin': 0
        });
      });
    });
  },

  renderGauges () {
    var _this = this;
    var data = this.get('model.tlData');

    Ember.run.next(function () {
      _.map(data, function (x) {
        var predData = [{label: 'pos', value: x.pos}, {label: 'neut', value: x.neut}, {label: 'neg', value: x.neg}];
        return _this.drawGauge('#gauge-' + x.id, predData);
      });
    });
  }, // This should really be broken apart

  drawGauge (bindTo, gaugeData) {
    // draw gauge gets called twice and we need this for now
    d3.select(bindTo).selectAll('svg').remove();

    var w = gconfig.GAUGE.SIZE.WIDTH;
    var h = gconfig.GAUGE.SIZE.HEIGHT / 2;
    var c = gconfig.GAUGE.COLOR_PATT;

    var r = w / 2;
    var ir = w / 4;
    var pi = Math.PI;
    var color = {pos: c[0], neut: c[1], neg: c[2]};
    var valueFormat = d3.format('.4p');

    var data = gaugeData;

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
  },

  renderTechan: function (forumdata, pvdata, routeId, subjectId, div, cb) {
    var parseDate = d3.time.format('%Y-%m-%d').parse;

    var pvData = _.chain(pvdata).map(function (d) {
      return {
        date: parseDate(d.date),
        open: +d.open,
        high: +d.high,
        low: +d.low,
        close: +d.close,
        volume: +d.volume
      };
    }).sortBy(function (a) { return a.date; }).value();

    var forumData = forumdata;

    var dateRange = d3.extent(_.flatten([_.pluck(pvData, 'date'),
      _.pluck(forumData, 'date')]));

    var dateSupport = getDates(dateRange);

    var includePV = true;

    function addDays (currentDate, days) {
      var dat = new Date(currentDate);
      dat.setDate(dat.getDate() + days);
      return dat;
    }

    function getDates (dateRange) {
      var dateArray = [];
      var currentDate = dateRange[0];

      while (currentDate <= dateRange[1]) {
        dateArray.push(new Date(currentDate));
        currentDate = addDays(currentDate, 1);
      }

      return dateArray;
    }

    var margin = {
      top: 20,
      bottom: 10,
      between: {
        y: 40,
        x: 40
      },
      left: 35,
      right: 5
    };
    var totalHeight = 400 - margin.top - margin.between.y - margin.bottom;
    var totalWidth = Ember.$('#techan-wrapper').width() - margin.left - margin.right;

    var posts = {};
    posts.title = 'Post Volume';
    posts.method = 'volume';
    posts.class = 'volume-posts';
    posts.width = totalWidth * 0.5;
    posts.height = totalHeight * 0.8 - 0.5 * margin.between.y;
    posts.position_left = margin.left;
    posts.position_top = margin.top;
    posts.x = techan.scale.financetime().range([0, posts.width]);
    posts.y = d3.scale.linear().range([posts.height, 0]);
    posts.plot = techan.plot.volume().xScale(posts.x).yScale(posts.y);
    posts.xAxis = d3.svg.axis().scale(posts.x).ticks(4).orient('bottom');
    posts.yAxis = d3.svg.axis().scale(posts.y).orient('left').ticks(4).tickFormat(d3.format('s'));

    var brushChart = {};
    brushChart.title = '';
    brushChart.method = 'volume';
    brushChart.class = 'brush-chart-posts';
    brushChart.width = totalWidth * 0.5;
    brushChart.height = totalHeight * 0.2 - 0.5 * margin.between.y;
    brushChart.position_left = margin.left;
    brushChart.position_top = totalHeight * 0.8 + margin.between.y;
    brushChart.x = techan.scale.financetime().range([0, brushChart.width]);
    brushChart.y = d3.scale.linear().range([brushChart.height, 0]);
    brushChart.plot = techan.plot.volume().xScale(brushChart.x).yScale(brushChart.y);
    brushChart.xAxis = d3.svg.axis().scale(brushChart.x).ticks(4).orient('bottom');
    brushChart.yAxis = d3.svg.axis().scale(brushChart.y).ticks(0).orient('left');

    var price = {};
    price.title = 'Price';
    price.method = 'ohlc';
    price.class = 'close';
    price.width = totalWidth * 0.5 - 2 * margin.between.x - 20;
    price.height = totalHeight * 0.5 - 0.5 * margin.between.y;
    price.position_left = totalWidth * 0.5 + 2 * margin.between.x;
    price.position_top = margin.top;
    price.x = techan.scale.financetime().range([0, price.width]);
    price.y = d3.scale.linear().range([price.height, 0]);
    price.plot = techan.plot.close().xScale(price.x).yScale(price.y);
    price.xAxis = d3.svg.axis().scale(price.x).ticks(4).orient('bottom');
    price.yAxis = d3.svg.axis().scale(price.y).orient('left').ticks(4);

    var volume = {};
    volume.title = 'Volume';
    volume.method = 'volume';
    volume.class = 'volume';
    volume.width = totalWidth * 0.5 - 2 * margin.between.x;
    volume.height = totalHeight * 0.5 - 0.5 * margin.between.y;
    volume.position_left = totalWidth * 0.5 + 2 * margin.between.x;
    volume.position_top = totalHeight * 0.5 + margin.between.y;
    volume.x = price.x;
    volume.y = d3.scale.linear().range([volume.height, 0]);
    volume.plot = techan.plot.volume().xScale(volume.x).yScale(volume.y);
    volume.xAxis = price.xAxis;
    volume.yAxis = d3.svg.axis().scale(volume.y).orient('left').ticks(4).tickFormat(d3.format('s'));

    var svg = d3.select(div).append('svg')
      .attr('width', totalWidth + margin.left + margin.between.x + margin.right)
      .attr('height', totalHeight + margin.top + margin.between.y + margin.bottom);

    function makeDiv (obj, clip) {
      var div = svg.append('g').attr('class', 'focus1').attr('id', obj.class)
        .attr('transform',
          'translate(' + obj.position_left + ',' + obj.position_top + ')');

      div.append('svg:clipPath')
        .attr('id', clip)
        .append('svg:rect')
        .attr('x', 0)
        .attr('y', obj.y(1))
        .attr('width', obj.width)
        .attr('height', obj.y(0) - obj.y(1));

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
    }

    posts.div = makeDiv(posts, 'c1');

    brushChart.div = makeDiv(brushChart, 'c2');
    brushChart.div.append('g').attr('class', 'pane'); // add hook for brush

    if (includePV) {
      price.div = makeDiv(price, 'c3');
      volume.div = makeDiv(volume, 'c4');
    }

    if (includePV) {
      // var accessor = price.plot.accessor()
      price.x.domain(dateSupport);
      price.y.domain(techan.scale.plot.ohlc(pvData).domain()).nice();
      price.div.select('g.close').datum(pvData);

      volume.x.domain(dateSupport);
      volume.y.domain([1000000, techan.scale.plot.volume(pvData).domain()[1]]);
      volume.div.select('g.volume').datum(pvData);
    }

    posts.x.domain(dateSupport);
    posts.y.domain(techan.scale.plot.volume(forumData).domain());
    posts.div.select('g.volume-posts').datum(forumData);

    brushChart.x.domain(dateSupport);
    brushChart.y.domain(techan.scale.plot.volume(forumData).domain());
    brushChart.div.select('g.brush-chart-posts').datum(forumData).call(brushChart.plot);
    brushChart.div.select('g.x.axis').call(brushChart.xAxis);
    brushChart.div.select('g.y.axis').call(brushChart.yAxis);

    // Associate the brush with the scale and render the brush
    // only AFTER a domain has been applied
    var brushZoom = brushChart.x.zoomable();
    var zoomable = price.x.zoomable();
    var zoomable2 = posts.x.zoomable();

    var brush = d3.svg.brush()
      .x(brushZoom)
      .on('brushend', draw);

    brushChart.div.select('g.pane')
      .call(brush)
      .selectAll('rect')
      .attr('height', brushChart.height);

    function _draw (obj, dateFilter) {
      var data = obj.div.select('g.' + obj.class).datum();

      var _data = _.filter(data, function (d) {
        return d.date > dateFilter[0] & d.date < dateFilter[1];
      });

      if (_data.length > 0) {
        obj.y.domain(techan.scale.plot[obj.method](_data).domain());
      } else {
        obj.y.domain([0, 1]);
      }

      // plot the data
      obj.div.select('g.' + obj.class).call(obj.plot);
      // draw the x / y axis for c2
      obj.div.select('g.x.axis').call(obj.xAxis);
      obj.div.select('g.y.axis').call(obj.yAxis);
    }

    function draw () {
      var brushDomain = brush.empty() ? brushZoom.domain() : brush.extent();
      var dateFilter = d3.extent(dateSupport.slice.apply(dateSupport, brushDomain));

      zoomable.domain(brushDomain);
      zoomable2.domain(brushDomain);

      if (includePV) {
        _draw(price, dateFilter);
        _draw(volume, dateFilter);
      }

      _draw(posts, dateFilter);

      cb(dateFilter);
    }

    /* set the initial size of the brush. The brush works on pixels, not on dates */
    if (forumData.length) {
      var mn = brushChart.x(forumData[0].date) / brushChart.width;
      brush.extent([brushZoom.domain()[1] * mn, brushZoom.domain()[1]]);
      brushChart.div.select('.pane').call(brush);
    }

    draw();
  },
  actions: {
    topXClicked (id) {
      var _this = this;
      Ember.$('#ts-' + id).toggleClass('chart-selected');
      var cik = this.controllerFor('detail').get('model.cik');
      this.toggleSplitByFilterMember(id);

      if (this.get('splitByFilter').length) {
        App.Search.fetch_data('cik2name', {'cik': cik}).then(function (cData) {
          App.Search.fetch_data('user', {ticker: cData.ticker, users: _this.get('splitByFilter'), date_filter: _this.get('dateFilter')}).then(function (response) {
            _this.set('filtered_data', _.map(response, function (x) {
              x.date = new Date(x.time);
              return x;
            }));
          });
        });
      } else {
        _this.set('filtered_data', this.get('model.data'));
      }
    },

    drilldown () {
      this.transitionTo(this.get('splitBy'), this.get(this.get('splitByFilter')).join(','));
    }
  }
});

App.BoardRoute = Ember.Route.extend({
  setupController: function (con, model, params) {
    con.set('isLoading', true);
    con.set('filtered_data', []);
    con.set('isData', true);

    var cik = this.controllerFor('detail').get('model.cik');
    console.log('CIK :: ', cik);
    App.Search.fetch_data('cik2name', {'cik': cik}).then(function (cData) {
      App.Search.fetch_data('board', {'ticker': cData.ticker, 'date_filter': con.get('dateFilter')}).then(function (response) {
        con.set('model', response);
        con.set('filtered_data', _.map(response.data, function (x) {
          x.date = new Date(x.time);
          return x;
        }));

        con.set('splitByFilter', []);
        con.set('splitBy', 'user');

        con.set('routeName', 'board');

        con.set('selection_ids', params.params[con.get('routeName')].ids);
        con.set(con.get('routeName') + '_filter', params.params[con.get('routeName')].ids);
        con.set('isLoading', false);

        if (!response.pvData.length) { con.set('isData', false); }
      });
    });
  }
});

Ember.Handlebars.helper('forum-posts', function (d, sbf) {
  var mincount = 20;
  var maxcount = 40;
  var ourString = '<div class="col-xs-6" id="forum-posts-cell">';

  if (d) {
    var data = _.sortBy(d, function (x) { return x.time; }).reverse();
  }

  Ember.$('.list-group li').slice(20).hide();
  Ember.$('.list-group').scroll(function () {
    if (Ember.$('.list-group').scrollTop() + Ember.$('.list-group').height() >= Ember.$('.list-group')[0].scrollHeight) {
      Ember.$('.list-group li').slice(mincount, maxcount).fadeIn(1000);
      mincount = mincount + 20;
      maxcount = maxcount + 40;
    }
  });

  ourString = ourString + '<div id="forum-div""><ul class="list-group" id="collection">';

  if (data) {
    for (var i = 0; i < data.length; i++) {
      ourString = ourString + '<li class="list-group-item comments-group-item" id="forum-item"><span class="list-group-item-heading" id="app-grey">' + data[i].user + ' at ' + data[i].time + ' on ' + data[i].board + '</span>';

      if (data[i].msg.length > 70) {
        var msg = data[i].msg.substring(0, 70);
        ourString = ourString + '<p class="list-group-item-text" id="app-msg">' + msg + '... (continued)</p><p class="full-msg">' + data[i].msg + '</p></li>';
      } else {
        ourString = ourString + '<p class="list-group-item-text" id="app-msg">' + data[i].msg + '</p><p class="full-msg">' + data[i].msg + '</p></li>';
      }
    }
  }
  ourString = ourString + '</ul></div></div>';
  return new Ember.Handlebars.SafeString(ourString);
}, 'sbf');

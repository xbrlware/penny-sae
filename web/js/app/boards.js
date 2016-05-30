/* global Ember, App, d3, c3, _, techan, crossfilter, gconfig, reductio, alert */

function makeTimeSeries (ts, bounds) {
  var div = '#ts-' + ts.id;
  var margin = {top: 10, right: 20, bottom: 20, left: 10};
  var FILL_COLOR = 'orange';
  var TEXT_COLOR = '#ccc';

  // Get cell height
  var height = Ember.$(div).height() - margin.top - margin.bottom;
  var width = Ember.$(div).width() - margin.left - margin.right;

  // Calculate bar width
  var BAR_WIDTH = 3;

  var data = _.chain(ts.timeseries).map(function (x) {
    return {
      'date': new Date(x.key),
      'value': +x.value
    };
  }).value();

  var x = d3.time.scale().range([0, width]);
  x.domain(d3.extent([bounds.xmin, bounds.xmax])).nice();

  var y = d3.scale.linear().range([height, 0]);
  y.domain([0, bounds.ymax]);

  // Clear previous values
  d3.select(div).selectAll('svg').remove();

  d3.select(div + ' .title').text(ts.name);
  d3.select(div + ' .before').text(ts.count.before);
  d3.select(div + ' .during').text(ts.count.during);
  d3.select(div + ' .after').text(ts.count.after);

  var svg = d3.select(div).append('svg:svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var xaxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(4)
    .tickFormat(d3.time.format('%b-%d %H'));

  svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0,' + (height) + ')')
    .call(xaxis)
    .attr('stroke', TEXT_COLOR);

  svg.selectAll('bar')
    .data(data)
    .enter().append('rect')
    .style('fill', FILL_COLOR)
    .attr('x', function (d) { return x(d.date); })
    .attr('width', BAR_WIDTH)
    .attr('y', function (d) { return y(d.value); })
    .attr('height', function (d) { return height - y(d.value); })
    .append('title')
    .text(function (d) { return d.date + ' : ' + d.value; });
}

function renderCooc (coocData, div, clickCallback) {
  if (!coocData) { return; }

  // Clear previous charts
  d3.select(div).selectAll('svg').remove();

  var margin = {top: 100, right: 0, bottom: 20, left: 120};
  var width = (Ember.$(div).width() > 0 ? Ember.$(div).width() : Ember.$('#vis-wrapper').width()) - margin.left - margin.right;
  var height = width;

  var colorRamp = [
    ['#000233', 1], // Background color
    ['#a50026', 0.99],
    ['#a50026', 0.9],
    ['#d73027', 0.8],
    ['#f46d43', 0.7],
    ['#fdae61', 0.6],
    ['#fee090', 0.5],
    ['#e0f3f8', 0.4],
    ['#abd9e9', 0.3],
    ['#74add1', 0.2],
    ['#4575b4', 0.1],
    ['#313695', 0]
  ];

  var x = d3.scale.ordinal().rangeBands([0, width]);
    // z = d3.scale.linear().domain([0, 1]).clamp(true),
  var color = d3.scale.linear()
      .domain(_.map(colorRamp, function (x) { return x[1]; }))
      .range(_.map(colorRamp, function (x) { return x[0]; }));

  var svg = d3.select(div).append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g').attr('transform',
    'translate(' + margin.left + ',' + margin.top + ')');

  var matrix = [];
  var nodes = coocData.nodes;
  var n = nodes.length;

  // Compute index per node.
  _.map(nodes, function (yNode, i) {
    yNode.index = i;
    matrix[i] = _.map(nodes, function (xNode, j) {
      return { x: j,
        y: i,
        xName: xNode.name,
        yName: yNode.name,
        col: 0,
        pct: 0
      };
    });
  });

  // Convert links to matrix; count character occurrences.
  coocData.links.forEach(function (link) {
    console.log(Math.pow(link.scaled_value, 0.5));
    matrix[link.source][link.target].col += (Math.pow(link.scaled_value, 0.5));
    matrix[link.source][link.target].pct += link.value;
  });

  var order = d3.range(n).sort(function (a, b) {
    return d3.ascending(nodes[a].index, nodes[b].index);
  });

  x.domain(order);

  svg.append('rect')
    .attr('class', 'background')
    .attr('width', width)
    .attr('height', height);

  svg.append('text').attr({
    'class': 'heatmap-info',
    'text-anchor': 'end',
    'x': width,
    'y': height + margin.bottom / 2,
    'fill': 'grey'
  });

  var row = svg.selectAll('.row')
    .data(matrix)
    .enter().append('g')
    .attr('class', 'row')
    .attr('transform', function (d, i) {
      return 'translate(0,' + x(i) + ')';
    })
    .each(makeRow);

  row.append('text')
    .attr('x', -6)
    .attr('y', x.rangeBand() / 2)
    .attr('size', function () { return '.25em'; })
    .attr('dy', '.32em')
    .attr('text-anchor', 'end')
    .text(function (d, i) { return nodes[i].name; })
    .attr('fill', 'grey');

  var column = svg.selectAll('.column')
    .data(matrix)
    .enter().append('g')
    .attr('class', 'column')
    .attr('transform', function (d, i) {
      return 'translate(' + x(i) + ')rotate(-90)';
    });

  column.append('text')
    .attr('x', 6)
    .attr('y', x.rangeBand() / 2)
    .attr('size', function () { return '.25em'; })
    .attr('dy', '.32em')
    .attr('text-anchor', 'start')
    .text(function (d, i) { return nodes[i].name; })
    .attr('fill', 'grey');

  function makeRow (row) {
    var cell = d3.select(this).selectAll('.cell').data(row).enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('x', function (d) { return x(d.x); })
      .attr('width', function () { return x.rangeBand(); })
      .attr('height', function () { return x.rangeBand(); })
      .style('fill', function (d) { return color(d.col); })
      .on('mouseover', mouseover)
      .on('mouseout', mouseout)
      .on('click', click);
    return cell;
  }

  function mouseover (p) {
    d3.selectAll('.row text').classed('active-cooc-label',
      function (d, i) { return i === p.y; });
    d3.selectAll('.column text').classed('active-cooc-label',
      function (d, i) { return i === p.x; });

    var p1 = Ember.$('.row text')[p.y].innerHTML;
    var p2 = Ember.$('.row text')[p.x].innerHTML;

    // Should set a tool tip
    var msg = p1 + ' and ' + p2 + ' have Jaccard Similarity of ' + p.pct;
    d3.select('.heatmap-info').text(msg);
  }

  function mouseout () {
    d3.selectAll('text').classed('active-cooc-label', false);
    d3.select('.heatmap-info').text('');
  }

  function click (p) {
    if (p.x === p.y) {
      // This is a hack -- I was having trouble adding multiple
      // classes to an SVG element, so I just set a flag and
      // change the fill accordingly
      Ember.$('.row text').filter(function (i) {
        return i === p.y;
      }).each(function (i, x) {
        if (Ember.$(x).attr('selected')) {
          Ember.$(x).attr('selected', false);
          Ember.$(x).attr('fill', 'grey');
        } else {
          Ember.$(x).attr('selected', true);
          Ember.$(x).attr('fill', 'orange');
        }
      });
      clickCallback(p);
    }
  }
}

function renderTechan (forumData, pvData, routeId, subjectId, div, cb) {
  d3.select(div).selectAll('svg').remove();
  var includePV = (pvData !== undefined && pvData.length > 0);

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

  function addCrosshair (obj) {
    var _yAnnotation = techan.plot.axisannotation()
      .axis(obj.yAxis)
      .format(d3.format(',.2fs'));
    var _xAnnotation = techan.plot.axisannotation()
      .axis(obj.xAxis)
      .format(d3.time.format('%Y-%m-%d'))
      .width(65)
      .translate([0, heights[0]]);

    return techan.plot.crosshair()
      .xScale(obj.x)
      .yScale(obj.y)
      .xAnnotation(_xAnnotation)
      .yAnnotation(_yAnnotation);
  }

  var margin = {
    top: 20,
    bottom: 10,
    between: {
      y: 40,
      x: 40
    },
    left: 30,
    right: 0
  };

  var totalHeight = 300 - margin.top - margin.between.y - margin.bottom;
  var totalWidth = Ember.$('#techan-wrapper').width() - margin.left - margin.right;
  var heights = [1, 0.5, 0.5];
  // var widths  = [0.5, 0.5, 0.5]
  // var n_panels = heights.length
  var parseDate = d3.time.format('%Y-%m-%d').parse;

  var posts = {};
  posts.title = 'Post Volume';
  posts.method = 'volume';
  posts.class = 'volume_posts';
  posts.width = includePV ? totalWidth * 0.5 : totalWidth;
  posts.height = totalHeight * heights[0];
  posts.position_left = margin.left;
  posts.position_top = margin.top;
  posts.x = techan.scale.financetime().range([0, posts.width]);
  posts.y = d3.scale.linear().range([posts.height, 0]);
  posts.plot = techan.plot.volume().xScale(posts.x).yScale(posts.y);
  posts.xAxis = d3.svg.axis().scale(posts.x).orient('bottom').ticks(5);
  posts.yAxis = d3.svg.axis().scale(posts.y).orient('left').ticks(6);
  //    posts['crosshair'] = ... // Doesn't work with brush

  var price = {};
  price.title = 'Price';
  price.method = 'ohlc';
  price.class = 'candlestick';
  price.width = totalWidth * 0.5 - 2 * margin.between.x;
  price.height = totalHeight * 0.5 - 0.5 * margin.between.y;
  price.position_left = totalWidth * 0.5 + 2 * margin.between.x;
  price.position_top = margin.top;
  price.x = techan.scale.financetime().range([0, price.width]);
  price.y = d3.scale.linear().range([price.height, 0]);
  price.plot = techan.plot.candlestick().xScale(price.x).yScale(price.y);
  price.xAxis = d3.svg.axis().scale(price.x).orient('bottom').ticks(5);
  price.yAxis = d3.svg.axis().scale(price.y).orient('left').ticks(4);
  price.crosshair = addCrosshair(price);

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
  volume.yAxis = d3.svg.axis().scale(volume.y).orient('left').ticks(4);
  volume.crosshair = addCrosshair(volume);

  var brush = d3.svg.brush().on('brushend', draw);

  var svg = d3.select(div).append('svg')
    .attr('width', totalWidth + margin.left + margin.between.x + margin.right)
    .attr('height', totalHeight + margin.top + margin.between.y + margin.bottom);

  function makeDiv (obj, clip) {
    var div = svg.append('g').attr('class', 'focus1')
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
      .attr('clip-path', 'url(/' + routeId + '/' + subjectId + '#' + clip + ')');

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
  posts.div.append('g').attr('class', 'pane'); // Add hook for brush

  if (includePV) {
    price.div = makeDiv(price, 'c2');
    volume.div = makeDiv(volume, 'c2');
  }

  pvData = _.chain(pvData.hits.hits).map(function (d) {
    return {
      date: parseDate(d._source.date),
      open: +d._source.open,
      high: +d._source.high,
      low: +d._source.low,
      close: +d._source.close,
      volume: +d._source.volume
    };
  }).sortBy(function (a) { return a.date; }).value();

  forumData = _.sortBy(forumData, function (x) { return x.date; });

  var dateRange = d3.extent(_.flatten([_.pluck(pvData, 'date'),
    _.pluck(forumData, 'date')]));
  var dateSupport = getDates(dateRange);

  if (includePV) {
    // var accessor = price.plot.accessor()
    price.x.domain(dateSupport);
    price.y.domain(techan.scale.plot.ohlc(pvData).domain());
    price.div.select('g.candlestick').datum(pvData);

    volume.x.domain(dateSupport);
    volume.y.domain(techan.scale.plot.volume(pvData).domain());
    volume.div.select('g.volume').datum(pvData);
  }

  posts.x.domain(dateSupport);
  posts.y.domain(techan.scale.plot.volume(forumData).domain());
  posts.div.select('g.volume_posts').datum(forumData).call(posts.plot);
  posts.div.select('g.x.axis').call(posts.xAxis);
  posts.div.select('g.y.axis').call(posts.yAxis);

  // Associate the brush with the scale and render the brush
  // only AFTER a domain has been applied
  var zoomable = price.x.zoomable();
  var zoomable2 = posts.x.zoomable();
  brush.x(zoomable2);
  posts.div.select('g.pane')
    .call(brush)
    .selectAll('rect')
    .attr('height', posts.height);

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
    var brushDomain = brush.empty() ? zoomable2.domain() : brush.extent();
    var dateFilter = d3.extent(dateSupport.slice.apply(dateSupport, brushDomain));

    zoomable.domain(brushDomain);

    if (includePV) {
      _draw(price, dateFilter);
      _draw(volume, dateFilter);
    }

    cb(dateFilter);
  }

  draw();
}

App.BoardController = Ember.Controller.extend({
  needs: ['application'],
  routeName: undefined,
  board_filter: undefined,
  user_filter: [],
  splitBy: 'board',
  selection_ids: undefined,
  routeName_pretty: function () {
    var rn = this.get('routeName');
    return rn.charAt(0).toUpperCase() + rn.substr(1).toLowerCase();
  }.property(),

  routeIsBoard: function () {
    return this.get('routeName') === 'board';
  }.property('routeName'),

  selection_pretty: function () {
    return _.chain(this.get('model.data')).pluck(this.get('routeName')).uniq().value();
  }.property('selection_ids.[]'),

  range_topX: function () {
    return _.range(0, gconfig.N_TOP_X);
  }.property(),

  // Field names for "splitting" entity (i.e. the user if board, board if user)
  splitByFilter: 'user_filter',

  post_filteredData: function () {
    var xId = this.get('splitBy_id');
    var out;

    if (this.splitByFilter.length) {
      out = _.filter(this.get('filteredData'), function (x) {
        return _.contains(this.splitByFilter, x[xId]);
      });
    } else {
      out = this.get('filteredData');
    }

    return _.chain(out).filter(function (x, i) {
      return i < 100;
    }).value();
  //        return _.chain(out).sortBy(function (x) { return x.date }).filter(function (x, i) { return i < 100 }).value()
  }.property('filteredData', 'board_filter', 'user_filter'),

  splitBy_id: function () {
    return this.get('splitBy') + '_id';
  }.property(),

  splitByFilter_nonempty: function () {
    return this.splitByFilter.length > 0;
  }.property('board_filter', 'user_filter'),

  n_posts: function () {
    if (this.get('splitByFilter_nonempty')) {
      return this.get('post_filteredData').length;
    } else {
      return this.get('model.data').length;
    }
  }.property('model.data', 'post_filteredData'),

  // Triggered when selection changes
  filter_did_change: function () {
    Ember.run.debounce(this, 'getAggs', gconfig.DEBOUNCE);
  }.observes('dateFilter', 'user_filter', 'board_filter'),

  filter_did_change_2: function () {
    Ember.run.debounce(this, 'getCooc', gconfig.DEBOUNCE);
  }.observes('dateFilter', 'board_filter'),

  draw: function () {
    Ember.run.schedule('afterRender', this, function () {
      var _this = this;
      var data = this.get('model.data');
      var pvData = this.get('model.pvData');
      var xId = this.get('splitBy_id');

      data.forEach(function (d, i) {
        d.index = i;
        d.date = new Date(d.date);
      });

      // For parent filter
      var datum = crossfilter(data);
      var date = datum.dimension(function (d) {
        return d.date;
      });
      var dates = date.group(d3.time.day);

      // For dependent filters
      var split = datum.dimension(function (d) {
        return d[xId];
      });
      var splits = split.group();
      var preds = {
        'neg': reductio().avg(function (d) {
          return (d.tri_pred || { 'neg': 0 }).neg;
        })(split.group()),
        'neut': reductio().avg(function (d) {
          return (d.tri_pred || {'neut': 0}).neut;
        })(split.group()),
        'pos': reductio().avg(function (d) {
          return (d.tri_pred || {'pos': 0}).pos;
        })(split.group())
      };

      var forumData = _.map(dates.all(), function (x) {
        return { 'date': x.key, 'volume': x.value };
      });

      // Whenever the brush moves, re-rendering everything.
      var renderAll = function (_this) {
        // Get all posts
        _this.set('filteredData', split.top(10e10));

        // Time series
        var topX = _.pluck(splits.top(10), 'key');
        _this.set('topX', topX);
        _this.renderX();

        // Gauges
        var topPreds = _.map(preds, function (pred) {
          return _.filter(pred.all(), function (x) {
            return _.contains(topX, x.key);
          });
        });

        _this.set('topPreds', _.object(_.keys(preds), topPreds));
        _this.renderGauges();
      };

      renderTechan(forumData, pvData, this.get('routeName'), this.get('selection_ids'), '#time-chart',
        function (dateFilter) {
          _this.set('dateFilter', dateFilter);
          date.filterRange(dateFilter);
          renderAll(_this);
        }
      );

      renderAll(_this);
    }.observes('model')
    );
  }.on('init'),

  toggleSplitByFilterMember (id) {
    var splitByFilter = this.get('splitByFilter');
    var xFilter = this.get(splitByFilter);

    if (_.contains(xFilter, id)) {
      this.set(splitByFilter, _.without(xFilter, id));
    } else {
      this.set(splitByFilter, _.union(xFilter, [id]));
    }
  },

  renderX () {
    var model = this.get('model');
    var filteredData = this.get('filteredData');
    var splitBy = this.get('splitBy');
    var topX = this.get('topX');
    var xId = this.get('splitBy_id');

    var dateFilter = this.get('dateFilter');

    // NB: I bet this would scale better if we used crossfilter reduces
    var topXData = _.filter(filteredData,
      function (x) {
        return _.contains(topX, x[xId]);
      }
    );

    var xmin = dateFilter ? dateFilter[0] : _.chain(topXData).pluck('date').map(function (x) {
      return new Date(x);
    }).min().value();

    var xmax = dateFilter ? dateFilter[1] : _.chain(topXData).pluck('date').map(function (x) {
      return new Date(x);
    }).max().value();

    var roundingFunction = (xmin - xmax) < (86400000 * 30) ? d3.time.hour : d3.time.day;

    var bySplit = _.chain(topXData).groupBy(function (x) {
      return x[xId];
    }).value();

    var timeseries = _.chain(bySplit).map(function (v, k) {
      return {
        'id': k,
        'name': v[0][splitBy],
        'count': {
          'during': v.length,
          'before': _.filter(model.data, function (x) {
            return x[xId] === k & (+x.date) < (+xmin);
          }).length,
          'after': _.filter(model.data, function (x) {
            return x[xId] === k & (+x.date) > (+xmax);
          }).length
        },
        'timeseries': _.chain(v)
          .pluck('date')
          .map(function (x) {
            return roundingFunction(new Date(x));
          })
          .countBy(function (x) {
            return x;
          })
          .map(function (v, k) {
            return {'key': k, 'value': v};
          }).value()
      };
    }).value();

    // Is this redundant?
    var flatVals = _.chain(timeseries).pluck('timeseries').flatten().value();
    var ymax = _.chain(flatVals).pluck('value').max().value();

    Ember.run.next(function () {
      _.map(timeseries, function (ts) {
        makeTimeSeries(ts, {
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
    var topPreds = this.get('topPreds');
    var topX = this.get('topX');

    Ember.run.next(function () {
      _.map(topX, function (x, i) {
        var predData = _.map(topPreds, function (topPred, k) {
          return [k,
            100 * _.findWhere(topPred, {'key': x}).value.avg];
        });

        // For gauges, we calculate the cumulative sum
        _.map(_.range(1, predData.length), function (i) {
          var tmp = predData[i][1] + predData[i - 1][1];
          predData[i][1] = tmp;
        });
        predData.reverse();

        return _this.drawGauge('#gauge-' + i, predData);
      });
    });
  }, // This should really be broken apart

  // This whole function is fairly messy
  drawGauge (bindto, data) {
    var gauge = c3.generate({
      bindto: bindto,
      transition: {
        duration: gconfig.GAUGE.TRANS_DURA
      },
      legend: {
        show: gconfig.GAUGE.LEGEND_SHOW
      },
      data: {
        columns: data,
        type: 'gauge',
        onclick: function () {
          return false;
        },
        onmouseover: function () {
          return false;
        },
        onmouseout: function () {
          return false;
        }
      },
      gauge: {
        label: {
          format: function () {
            return undefined;
          },
          show: gconfig.GAUGE.LABEL.SHOW
        },
        width: gconfig.GAUGE.LABEL.WIDTH
      },
      color: {
        pattern: gconfig.GAUGE.COLOR_PATT
      },
      size: {
        height: gconfig.GAUGE.SIZE.HEIGHT,
        width: gconfig.GAUGE.SIZE.WIDTH
      },
      tooltip: {
        show: gconfig.GAUGE.TOOLTIP_SHOW
      }
    });
    return gauge;
  },

  // Significant terms aggs, NER aggs
  getAggs () {
    var self = this;
    var runner = {
      board_ids: this.get('board_filter'),
      date: this.get('dateFilter'),
      userIds: this.get('user_filter')};

    Ember.$.ajax({
      url: gconfig.GET_AGGS_URL,
      type: 'POST',
      dataType: 'json',
      contentType: 'application/x-www-form-urlencoded',
      data: runner,
      success: function (response) {
        self.set('aggs', response);
      }
    });
  },

  // Coocurrance matrix
  getCooc () {
    if (this.get('routeName') === 'board') {
      Ember.$.ajax({
        url: gconfig.GET_COOC_URL,
        type: 'get',
        contentType: 'application/json',
        dataType: 'JSON',
        data: JSON.stringify({
          'board_ids': this.get('board_filter'),
          'date': this.get('dateFilter'),
          // 'userIds'   : this.get('user_filter')
          'userIds': []
        }),
        success: function (response) {
          if (response) {
            this.set('cooc', response.data);
            renderCooc(response.data, '#cooc', this.coocCallback.bind(this));
          } else {
            console.log('no response from R server');
          }
        }
      });
    }
  },

  coocCallback (p) {
    if (p.x === p.y) {
      Ember.$.ajax({
        url: gconfig.COOC_URL,
        type: 'get',
        contentType: 'application/json',
        dataType: 'JSON',
        data: p.xName,
        success: function (response) {
          this.toggleSplitByFilterMember(response);
        }
      });
    }
  },

  actions: {
    topXClicked (id) {
      Ember.$('#ts-' + id).toggleClass('chart-selected');
      this.toggleSplitByFilterMember(id);
    },

    drilldown () {
      this.transitionTo(this.get('splitBy'), this.get(this.get('splitByFilter')).join(','));
    }
  }
});

App.BoardRoute = Ember.Route.extend({
  model: function (params) {
    var _this = this;
    return new Ember.RSVP.Promise(function (resolve) {
      Ember.$.ajax({
        url: _this.routeName,
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        data: {id: 17838},
        success: function (data) {
          console.log('data ::', data);
          resolve(data);
        }
      });
    });
  },

  setupController: function (con, model, params) {
    console.log(this.routeName + ' :: setting up controller');

    con.set('model', model);
    con.set('routeName', this.routeName);

    // Reset both search terms
    this.controllerFor('application').set('board_searchterm', '');
    this.controllerFor('application').set('user_searchterm', '');

    // Reset both filters
    con.set('board_filter', []);
    con.set('user_filter', []);

    // Make route aware of splitting variable
    if (this.routeName === 'user') {
      con.set('splitBy', 'board');
    } else if (this.routeName === 'board') {
      con.set('splitBy', 'user');
    } else {
      alert('unknown routeName!');
    }

    // Populate appropriate filter
    con.set('selection_ids', params.params[this.routeName].ids);
    con.set(this.routeName + '_filter', params.params[this.routeName].ids);

    console.log(this.routeName + ' :: done setting up controller');
  }
});

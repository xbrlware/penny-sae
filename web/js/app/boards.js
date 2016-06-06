/* global Ember, App, d3, c3, _, techan, crossfilter, gconfig, reductio, alert */

Ember.Handlebars.helper('forum-posts', function (data) {
  var mincount = 20;
  var maxcount = 40;
  var ourString = '';

  Ember.$('.list-group li').slice(20).hide();
  Ember.$('.list-group').scroll(function () {
    if (Ember.$('.list-group').scrollTop() + Ember.$('.list-group').height() >= Ember.$('.list-group')[0].scrollHeight) {
      Ember.$('.list-group li').slice(mincount, maxcount).fadeIn(1000);
      mincount = mincount + 20;
      maxcount = maxcount + 40;
    }
  });

  ourString = ourString + '<div class="col-xs-12" id="forum-div""><ul class="list-group" id="collection">';

  if (data) {
    for (var i = 0; i < data.length; i++) {
      ourString = ourString + '<li class="list-group-item comments-group-item" id="forum-item"><span class="list-group-item-heading" id="app-grey">' + data[i].user + ' at ' + data[i].time + ' on ' + data[i].board + '</span><p class="list-group-item-text" id="app-msg">' + data[i].msg + '</p></li>';
    }
  }
  ourString = ourString + '</ul></div>';

  return new Ember.Handlebars.SafeString(ourString);
});

function makeTimeSeries (ts, bounds) {
  var div = '#ts-' + ts.id;
  var margin = {top: 10, right: 30, bottom: 20, left: 30};
  var FILL_COLOR = 'orange';
  var TEXT_COLOR = '#ccc';

  // Get cell height
  var height = Ember.$(div).height();
  var width = Ember.$(div).width();

  // Calculate bar width
  var BAR_WIDTH = 2;

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
    .ticks(3)
    .tickFormat(d3.time.format('%b-%d-%y'));

  svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0,' + height + ')')
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
    left: 25,
    right: 5
  };

  var totalHeight = 400 - margin.top - margin.between.y - margin.bottom;
  var totalWidth = Ember.$('#techan-wrapper').width() - margin.left - margin.right;
  var heights = [1, 0.5, 0.5];
  // var widths  = [0.5, 0.5, 0.5]
  // var n_panels = heights.length
  var parseDate = d3.time.format('%Y-%m-%d').parse;

  var posts = {};
  posts.title = 'Post Volume';
  posts.method = 'volume';
  posts.class = 'volume_posts';
  posts.width = totalWidth * 0.5;
  // posts.height = totalHeight * heights[0];
  posts.height = totalHeight * 0.5 - 0.5 * margin.between.y;
  posts.position_left = margin.left;
  posts.position_top = margin.top;
  posts.x = techan.scale.financetime().range([0, posts.width]);
  posts.y = d3.scale.linear().range([posts.height, 0]);
  posts.plot = techan.plot.volume().xScale(posts.x).yScale(posts.y);
  posts.xAxis = d3.svg.axis().scale(posts.x).orient('bottom').ticks(5);
  posts.yAxis = d3.svg.axis().scale(posts.y).orient('left').ticks(6);

  var crowdsar = {};
  crowdsar.title = 'Post Crowdsar';
  crowdsar.method = 'volume';
  crowdsar.class = 'crowdsar_posts';
  crowdsar.width = totalWidth * 0.5;
  crowdsar.height = totalHeight * 0.5 - 0.5 * margin.between.y;
  crowdsar.position_left = margin.left;
  crowdsar.position_top = totalHeight * 0.5 + margin.between.y;
  crowdsar.x = techan.scale.financetime().range([0, crowdsar.width]);
  crowdsar.y = d3.scale.linear().range([crowdsar.height, 0]);
  crowdsar.plot = techan.plot.volume().xScale(crowdsar.x).yScale(crowdsar.y);
  crowdsar.xAxis = d3.svg.axis().scale(crowdsar.x).orient('bottom').ticks(5);
  crowdsar.yAxis = d3.svg.axis().scale(crowdsar.y).orient('left').ticks(6);

  var price = {};
  price.title = 'Price';
  price.method = 'ohlc';
  price.class = 'close';
  price.width = includePV ? totalWidth * 0.5 - 2 * margin.between.x : totalWidth;
  price.height = totalHeight * 0.5 - 0.5 * margin.between.y;
  price.position_left = totalWidth * 0.5 + 2 * margin.between.x;
  price.position_top = margin.top;
  price.x = techan.scale.financetime().range([0, price.width]);
  price.y = d3.scale.linear().range([price.height, 0]);
  price.plot = techan.plot.close().xScale(price.x).yScale(price.y);
  price.xAxis = d3.svg.axis().scale(price.x).orient('bottom').ticks(5);
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
      .attr('clip-path', 'url(/' + routeId + '/' + '#' + clip + ')');

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

  crowdsar.div = makeDiv(crowdsar, 'c1');

  if (includePV) {
    price.div = makeDiv(price, 'c2');
    volume.div = makeDiv(volume, 'c2');
  }

  pvData = _.chain(pvData).map(function (d) {
    return {
      date: parseDate(d._source.date),
      open: +d._source.open,
      high: +d._source.high,
      low: +d._source.low,
      close: +d._source.close,
      volume: +d._source.volume
    };
  }).sortBy(function (a) { return a.date; }).value();

  forumData = _.sortBy(forumData, function (x) {
    return x.date;
  });

  var dateRange = d3.extent(_.flatten([_.pluck(pvData, 'date'),
    _.pluck(forumData, 'date')]));
  var dateSupport = getDates(dateRange);

  if (includePV) {
    // var accessor = price.plot.accessor()
    price.x.domain(dateSupport);
    price.y.domain(techan.scale.plot.ohlc(pvData).domain());
    price.div.select('g.close').datum(pvData);

    volume.x.domain(dateSupport);
    volume.y.domain(techan.scale.plot.volume(pvData).domain());
    volume.div.select('g.volume').datum(pvData);
  }

  posts.x.domain(dateSupport);
  posts.y.domain(techan.scale.plot.volume(forumData).domain());
  posts.div.select('g.volume_posts').datum(forumData).call(posts.plot);
  posts.div.select('g.x.axis').call(posts.xAxis);
  posts.div.select('g.y.axis').call(posts.yAxis);

  crowdsar.x.domain(dateSupport);
  crowdsar.y.domain(techan.scale.plot.volume(forumData).domain());
  crowdsar.div.select('g.crowdsar_posts').datum(forumData).call(crowdsar.plot);
  crowdsar.div.select('g.x.axis').call(crowdsar.xAxis);
  crowdsar.div.select('g.y.axis').call(crowdsar.yAxis);

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
  needs: ['application', 'detail'],
  name: Ember.computed.alias('controllers.detail.model'),
  routeName: undefined,
  board_filter: undefined,
  user_filter: [],
  splitBy: 'user',
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
  splitByFilter: 'board_filter',

  filtered_data: [],

  post_filtered_data: function () {
    var xId = this.get('splitById'); // xId === user_id
    var out;

    if (this.splitByFilter.length) { // this.splitByFilter === board_filter
      out = _.filter(this.get('filtered_data'), function (x) {
        return _.contains(this.splitByFilter, x[xId]);
      });
    } else {
      out = this.get('filtered_data');
    }
    return _.chain(out).filter(function (x, i) {
      return i < 100;
    }).value();
  //        return _.chain(out).sortBy(function (x) { return x.date }).filter(function (x, i) { return i < 100 }).value()
  }.property('filtered_data', 'board_filter', 'user_filter'),

  splitById: function () {
    return this.get('splitBy') + '_id';
  }.property(),

  splitByFilter_nonempty: function () {
    return this.splitByFilter.length > 0;
  }.property('board_filter', 'user_filter'),

  draw: function () {
    var _this = this;
    var data = this.get('model.data');
    var pvData = this.get('model.pvData');
    var xId = this.get('splitById');

    data.forEach(function (d, i) {
      d.index = i;
      d.date = new Date(d.time);
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
        return (d.__meta__.tri_pred || { 'neg': 0 }).neg;
      })(split.group()),
      'neut': reductio().avg(function (d) {
        return (d.__meta__.tri_pred || {'neut': 0}).neut;
      })(split.group()),
      'pos': reductio().avg(function (d) {
        return (d.__meta__.tri_pred || {'pos': 0}).pos;
      })(split.group())
    };

    var forumData = _.map(dates.all(), function (x) {
      return { 'date': x.key, 'volume': x.value };
    });

    // Whenever the brush moves, re-rendering everything.
    var renderAll = function (_this) {
      // Get all posts

      _this.set('filtered_data', split.top(10));

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
  }.observes('model'),

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
    // var filteredData = this.get('filtered_data');
    var splitBy = this.get('splitBy');
    var topX = this.get('topX');
    var xId = this.get('splitById');

    var dateFilter = this.get('dateFilter');

    // NB: I bet this would scale better if we used crossfilter reduces
    var topXData = _.filter(model.data,
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
          .pluck('time')
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

  renderForumPosts () {
    var mincount = 20;
    var maxcount = 40;
    Ember.$('.list-group li').slice(20).hide();
    Ember.$('.list-group').scroll(function () {
      if (Ember.$('.list-group').scrollTop() + Ember.$('.list-group').height() >= Ember.$('.list-group')[0].scrollHeight) {
        Ember.$('.list-group li').slice(mincount, maxcount).fadeIn(1000);
        mincount = mincount + 20;
        maxcount = maxcount + 20;
      }
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

        return _this.drawGauge('#gauge-' + x, predData);
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
  setupController: function (con, model, params) {
    var _this = this;

    App.Search.fetch_data('board', this.get('controller.name')).then(function (response) {
      con.set('model', response);
      con.set('routeName', _this.routeName);

      // Reset both search terms
      _this.controllerFor('application').set('board_searchterm', '');
      _this.controllerFor('application').set('user_searchterm', '');

      // Reset both filters
      con.set('board_filter', []);
      con.set('user_filter', []);
      con.set('filtered_data', _this.get('model.data'));

      // Make route aware of splitting variable
      if (_this.routeName === 'user') {
        con.set('splitBy', 'board');
      } else if (_this.routeName === 'board') {
        con.set('splitBy', 'user');
      } else {
        alert('unknown routeName!');
      }

      // Populate appropriate filter
      con.set('selection_ids', params.params[_this.routeName].ids);
      con.set(_this.routeName + '_filter', params.params[_this.routeName].ids);
    });
  }
});

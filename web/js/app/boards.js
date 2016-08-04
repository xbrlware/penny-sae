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
  dateFilter: [new Date(gconfig.DEFAULT_DATE_FILTER[0]), new Date(gconfig.DEFAULT_DATE_FILTER[1])],
  defaultAscDesc: function () {
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
    var rn = this.get('routeName');
    return rn.charAt(0).toUpperCase() + rn.substr(1).toLowerCase();
  }.property(),

  // Field names for "splitting" entity (i.e. the user if board, board if user)
  splitByFilter: function () {
    return [];
  }.property(),

  dateDiff: function (startDate, endDate) {
    // Does not take daylight savings in account
    var oneDay = 24 * 60 * 60 * 1000;
    var firstDate = new Date(startDate);
    var secondDate = new Date(endDate);

    return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
  },

  makeTimeSeries: function (ts, bounds) {
    var _this = this;
    var div = '#ts-' + ts.id;
    var margin = {top: 13, right: 20, bottom: 20, left: 0};
    var FILL_COLOR = 'orange';
    var TEXT_COLOR = '#ccc';

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
    var width = (Ember.$('#gauge-timeline-cell').width() * 0.60);

    var x = d3.time.scale().range([0, width - (margin.left + margin.right)]);
    x.domain(d3.extent([bounds.xmin, bounds.xmax])).nice();

    var y = d3.scale.linear().range([height, 0]);
    y.domain([0, ts.max]);

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
      .tickValues([ts.mean, ts.max]);

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
    var data = this.get('filtered_data');
    var sbf = this.get('splitByFilter');
    var dfl = this.get('dateFilter');
    var pgc = this.get('pageCount');
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
        return _.contains(sbf, x.user_id);
      });
    } else {
      out = _data;
    }

    var r;
    if ((100 * pgc) < out.length) {
      r = _.chain(out).filter(function (x, i) {
        return i < (100 * pgc);
      }).value();
    } else {
      r = out;
    }
    return r;
  }.property('filtered_data', 'dateFilter', 'pageCount'),

  redraw: function (numPosters = 10) {
    var _this = this;
    var data = {
      cik: this.controllerFor('detail').get('model.cik'),
      date_filter: this.get('dateFilter'),
      search_term: this.get('searchTerm'),
      size: numPosters
    };

    this.set('timelineLoading', true);

    App.Search.fetch_data('redraw', data).then(function (response) {
      _this.set('splitByFilter', []);
      _this.set('pageCount', 1);
      _this.set('model.tlData', response.tlData);
      _this.set('model.data', response.data);
      _this.set('filtered_data', _.map(response.data, function (x) {
        x.date = new Date(x.date);
        return x;
      }));
      _this.renderX();
      _this.renderGauges();
      _this.set('timelineLoading', false);
    });
  },

  draw: function () {
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

    this.renderCharts(forumData, pvData, this.get('routeName'), this.get('selection_ids'), '#time-chart',
      function (dateFilter) {
        _this.set('dateFilter', dateFilter);
        date.filterRange(dateFilter);
        renderAll(_this);
      }
    );
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
    var _this = this;
    var model = this.get('model.tlData');
    var ascDesc = this.get('ascDesc');

    if (ascDesc[ascDesc.type] === 'asc') {
      model = _.sortBy(model, ascDesc.type === 'doc' ? 'doc_count' : ascDesc.type);
    } else {
      model = _.sortBy(model, ascDesc.type === 'doc' ? 'doc_count' : ascDesc.type).reverse();
    }

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
        }),
        'max': v.max,
        'mean': v.mean,
        'min': v.min
      };
    }).value();

    this.set('topX', topx);

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
    d3.select(bindTo).selectAll('svg').remove();
    var _this = this;
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

  renderCharts: function (forumData, pvdata, routeId, subjectId, div, cb) {
    var _this = this;
    var parseDate = d3.time.format('%Y-%m-%d').parse;
    var parseDateTip = d3.time.format('%b-%d');
    var margin = { top: 20, bottom: 10, between: { y: 40, x: 40 }, left: 35, right: 5 };
    var totalHeight = 400 - margin.top - margin.between.y - margin.bottom;
    var totalWidth = Ember.$('#techan-wrapper').width() - margin.left - margin.right;

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

    var posts = {};
    posts.title = 'Post Volume';
    posts.class = 'volume-posts';
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

    var brushChart = {};
    brushChart.title = '';
    brushChart.class = 'brush-chart-posts';
    brushChart.width = totalWidth * 0.5;
    brushChart.height = totalHeight * 0.2 - 0.5 * margin.between.y;
    brushChart.position_left = margin.left;
    brushChart.position_top = totalHeight * 0.8 + margin.between.y;
    brushChart.x = d3.time.scale().range([0, brushChart.width]);
    brushChart.y = d3.scale.linear().range([brushChart.height, 0]);
    brushChart.xAxis = d3.svg.axis().scale(brushChart.x).ticks(4).orient('bottom');
    brushChart.yAxis = d3.svg.axis().scale(brushChart.y).ticks(0).orient('left');
    brushChart.brush = d3.svg.brush().x(brushChart.x).on('brushend', rtDraw);

    var price = {};
    price.title = 'Price';
    price.class = 'close';
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

    var volume = {};
    volume.title = 'Volume';
    volume.class = 'volume';
    volume.width = totalWidth * 0.5 - 2 * margin.between.x - 20;
    volume.height = totalHeight * 0.5 - 0.5 * margin.between.y;
    volume.position_left = totalWidth * 0.5 + 2 * margin.between.x;
    volume.position_top = totalHeight * 0.5 + margin.between.y;
    volume.x = d3.time.scale().range([0, volume.width]);
    volume.y = d3.scale.linear().range([volume.height, 0]);
    volume.xAxis = price.xAxis;
    volume.yAxis = d3.svg.axis().scale(volume.y).orient('left').ticks(4).tickFormat(d3.format('s'));
    volume.tip = d3.tip().attr('class', 'techan-tip').offset([-10, -2]).html(function (d) {
      return '<center><span>' + parseDateTip(d.date) + '</span><br /><span>' + d.volume + '</span></center>';
    });

    var svg = d3.select(div).append('svg')
      .attr('width', totalWidth + margin.left + margin.between.x + margin.right)
      .attr('height', totalHeight + margin.top + margin.between.y + margin.bottom);

    function makeDiv (obj, clip) {
      var div = svg.append('g').attr('class', 'focus1').attr('id', obj.class)
        .attr('transform',
          'translate(' + obj.position_left + ',' + obj.position_top + ')');

      div.append('defs').append('clipPath')
        .attr('id', clip)
        .append('rect')
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
    posts.x.domain(d3.extent(forumData, function (d) { return d.date; }));
    posts.y.domain(d3.extent(forumData, function (d) { return d.volume; }));
    posts.div.select('g.volume-posts').datum(forumData);

    brushChart.div = makeDiv(brushChart, 'c2');
    brushChart.x.domain(posts.x.domain());
    brushChart.y.domain(posts.y.domain());
    brushChart.div.select('g.brush-chart-posts').datum(forumData);

    price.div = makeDiv(price, 'c3');
    price.x.domain(d3.extent(pvData, function (d) { return d.date; }));
    price.y.domain(d3.extent(pvData, function (d) { return d.close; }));
    price.div.select('g.close').datum(pvData);

    volume.div = makeDiv(volume, 'c4');
    volume.x.domain(d3.extent(pvData, function (d) { return d.date; }));
    volume.y.domain(d3.extent(pvData, function (d) { return d.volume; }));
    volume.div.select('g.volume').datum(pvData);

    function _draw (obj, dateFilter) {
      var data = obj.div.select('g.' + obj.class).datum();

      var _data = _.filter(data, function (d) {
        return d.date > dateFilter[0] & d.date < dateFilter[1];
      });

      obj.x.domain(dateFilter);

      if (obj.class === 'close') {
        obj.y.domain(d3.extent(_data, function (d) { return d.close; }));
        obj.div.selectAll('.dot').remove();
        obj.div.selectAll('.line').remove();

        var line = d3.svg.line()
          .x(function (d) { return obj.x(d.date); })
          .y(function (d) { return obj.y(d.close); });

        obj.div.select('g.' + obj.class).append('path')
          .datum(_data)
          .attr('class', 'line')
          .attr('d', line);

        obj.div.selectAll('.dot')
            .data(_data)
            .enter().append('circle')
            .attr('class', 'dot')
            .attr('opacity', '0.0')
            .attr('r', 3)
            .attr('cx', function (d) { return obj.x(d.date); })
            .attr('cy', function (d) { return obj.y(d.close); })
            .on('mouseover', obj.tip.show)
            .on('mouseout', obj.tip.hide);

        obj.div.call(obj.tip);
      }

      if (obj.class !== 'close') {
        obj.y.domain(d3.extent(_data, function (d) { return d.volume; }));
        obj.div.selectAll('.bar').remove();

        var dd = _this.dateDiff(obj.x.domain()[0], obj.x.domain()[1]);
        var barWidth = obj.width / dd;

        obj.div.selectAll('.bar')
          .data(_data)
          .enter().append('rect')
          .attr('class', 'bar')
          .attr('x', function (d) { return obj.x(d.date); })
          .attr('width', barWidth)
          .attr('y', function (d) { return obj.y(d.volume); })
          .attr('height', function (d) { return obj.height - obj.y(d.volume); });

        if (obj.class !== 'brush-chart-posts') {
          obj.div.selectAll('.bar')
            .on('mouseover', obj.tip.show)
            .on('mouseout', obj.tip.hide);
          obj.div.call(obj.tip);
        } else {
          obj.div.append('g')
            .attr('class', 'x brush')
            .call(obj.brush)
            .selectAll('rect')
            .attr('y', -1)
            .attr('height', obj.height);
        }
      }
      obj.div.select('g.x.axis').call(obj.xAxis);
      obj.div.selectAll('g.y.axis').call(obj.yAxis);
    }

    function rtDraw () {
      var brushDomain = brushChart.brush.empty() ? price.x.domain() : brushChart.brush.extent();

      _draw(price, brushDomain);
      _draw(volume, brushDomain);
      _draw(posts, brushDomain);

      cb(brushDomain);
    }

    _draw(brushChart, [price.x.domain()[0], brushChart.x.domain()[1]]);
    brushChart.brush.extent(d3.extent(forumData, function (d) { return d.date; }));
    brushChart.brush(d3.select('.brush').transition());
    rtDraw();
  },

  sortPosters: function (sortType) {
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
    var c = st === 'pos' || st === 'neut' || st === 'neg' ? '.sentiment' : '.numposts';
    this.setFilterDecoration(st, c);
    this.sortPosters(st);
  },

  actions: {
    numPosters: function (num) {
      this.redraw(Number(num) < 1 ? 1 : Number(num));
    },

    sortUsers: function (sortType) {
      this.sortTimelines(sortType);
    },

    ascdesc: function (btn) {
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

    topXClicked (id) {
      var _this = this;
      this.set('pageCount', 1);
      Ember.$('#ts-' + id).toggleClass('chart-selected');
      var cik = this.controllerFor('detail').get('model.cik');
      this.toggleSplitByFilterMember(id);

      if (this.get('splitByFilter').length) {
        App.Search.fetch_data('user', {cik: cik, users: this.get('splitByFilter'), date_filter: this.get('dateFilter'), search_term: this.get('searchTerm')}).then(function (response) {
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
      this.set('searchTerm', searchTerm);
      this.redraw();
    }
  }
});

App.BoardRoute = Ember.Route.extend({
  setupController: function (con, model, params) {
    con.set('isLoading', true);
    con.set('filtered_data', []);
    con.set('isData', true);
    con.set('searchTerm', '');

    // set poster sort object this.ascDesc
    con.defaultAscDesc();

    var cik = this.controllerFor('detail').get('model.cik');
    App.Search.fetch_data('cik2name', {'cik': cik}).then(function (cData) {
      App.Search.fetch_data('board', {'cik': cik, 'ticker': cData.ticker, 'date_filter': con.get('dateFilter')}).then(function (response) {
        con.set('model', response);
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

App.BoardView = Ember.View.extend({
  didInsertElement: function () {
    this._super();
    var _this = this;
    // lazy loading of forum messages -- currently only supports 1000 message max
    Ember.run.scheduleOnce('afterRender', this, function () {
      Ember.$('.forum-div').scroll(function () {
        if (Ember.$('.forum-div').scrollTop() + Ember.$('.forum-div').height() >= Ember.$('.forum-div')[0].scrollHeight) {
          var con = _this.get('controller');
          var pgc = con.get('pageCount');
          if (pgc < 10) {
            pgc++;
            con.set('pageCount', pgc);
          }
        }
      });
    });
  }
});

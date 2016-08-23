/* global Ember, App, d3, _, sessionStorage, gconfig */

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
  postsChart: {},
  brushChart: {},
  priceChart: {},
  volumeChart: {},
  searchTerm: '',
  sentiment: 'na',
  numOfPosters: 10,
  dateFilter: [new Date(gconfig.DEFAULT_DATE_FILTER[0]), new Date(gconfig.DEFAULT_DATE_FILTER[1])],
  ChartsObj: App.Chart.create(),
  rtDraw: function () {
    /* fired during init and when the brush moves */
    var data = this.get('model.ptData');
    var pvdata = this.get('model.pvData');

    var parseDate = d3.time.format('%Y-%m-%d').parse;

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

    var forumData = _.map(data, function (x) {
      return { 'date': new Date(x.date), 'volume': x.value };
    });

    // don't let the brush change the sort
    var ad = this.get('ascDesc');
    ad[ad.type] = ad[ad.type] === 'asc' ? 'desc' : 'asc';
    sessionStorage.pennyFilters = JSON.stringify(ad);

    var brushDomain = this.brushChart.brush.empty() ? this.priceChart.x.domain() : this.brushChart.brush.extent();

    this.ChartsObj.makeBarChart(this.postsChart, forumData, brushDomain);
    this.ChartsObj.makeClose(this.priceChart, pvData, brushDomain);
    this.ChartsObj.makeBarChart(this.volumeChart, pvData, brushDomain);
    this.set('dateFilter', brushDomain);
  },

  createChartDimensions: function (id, hMultiplier) {
    var w = Ember.$(id).width();
    var h = w * hMultiplier;
    var x = d3.time.scale().range([0, w]);
    var y = d3.scale.linear().range([h, 0]);
    return {
      width: w,
      height: h,
      x: x,
      y: y
    };
  },

  initChartObjects: function () {
    var _this = this;
    function brushed () {
      _this.rtDraw();
      _this.redraw();
    }

    var parseDateTip = d3.time.format('%b-%d');
    var a = this.createChartDimensions('#tl-posts-volume', 0.6);
    this.set('postsChart', {
      id: '#tl-posts-volume',
      margin: { top: 10, bottom: 20, left: 35, right: 40 },
      title: 'Post Volume',
      class: 'volume-posts',
      clip: 'c1',
      width: a.width + 35 + 40,
      height: a.height,
      x: a.x,
      y: a.y,
      xAxis: d3.svg.axis().scale(a.x).ticks(4).orient('bottom').tickFormat(d3.time.format('%m-%Y')),
      yAxis: d3.svg.axis().scale(a.y).orient('left').ticks(4),
      tip: d3.tip().attr('class', 'techan-tip').offset([-10, -2]).html(function (d) {
        return '<center><span>' + parseDateTip(d.date) + '</span><br /><span>' + d.volume + '</span></center>';
      })
    });

    a = this.createChartDimensions('#tl-brush-chart', 0.2);
    this.set('brushChart', {
      id: '#tl-brush-chart',
      margin: { top: 10, bottom: 20, left: 35, right: 40 },
      title: '',
      class: 'brush-chart-posts',
      clip: 'c2',
      width: a.width + 35 + 40,
      height: a.height,
      x: a.x,
      y: a.y,
      xAxis: d3.svg.axis().scale(a.x).ticks(4).orient('bottom'),
      yAxis: d3.svg.axis().scale(a.y).ticks(0).orient('left'),
      brush: d3.svg.brush().x(a.x).on('brushend', brushed)
    });

    a = this.createChartDimensions('#pv-price-chart', 0.6);
    this.set('priceChart', {
      id: '#pv-price-chart',
      margin: { top: 10, bottom: 20, left: 45, right: 40 },
      title: 'Price',
      class: 'close',
      clip: 'c3',
      width: a.width + 35 + 40,
      height: a.height,
      x: a.x,
      y: a.y.nice(),
      xAxis: d3.svg.axis().scale(a.x).ticks(4).orient('bottom').tickFormat(d3.time.format('%m-%Y')),
      yAxis: d3.svg.axis().scale(a.y).orient('left').ticks(4),
      tip: d3.tip().attr('class', 'techan-tip').offset([-10, -2]).html(function (d) {
        return '<center><span>' + parseDateTip(d.date) + '</span><br /><span>Open: ' + d.open + '</span><br /><span>Close: ' + d.close + '</span><br /><span>High: ' + d.high + '</span><br /><span>Low: ' + d.low + '</span></center>';
      })
    });

    a = this.createChartDimensions('#pv-volume-chart', 0.2);
    this.set('volumeChart', {
      id: '#pv-volume-chart',
      margin: { top: 10, bottom: 20, left: 45, right: 40 },
      title: 'Volume',
      class: 'volume',
      clip: 'c4',
      width: a.width + 35 + 40,
      height: a.height,
      x: a.x,
      y: a.y,
      xAxis: d3.svg.axis().scale(a.x).ticks(4).orient('bottom').tickFormat(d3.time.format('%m-%Y')),
      yAxis: d3.svg.axis().scale(a.y).orient('left').ticks(4).tickFormat(d3.format('s')),
      tip: d3.tip().attr('class', 'techan-tip').offset([-10, -2]).html(function (d) {
        return '<center><span>' + parseDateTip(d.date) + '</span><br /><span>' + d.volume + '</span></center>';
      })
    });
  },

  defaultAscDesc: function () {
    /* sets default value for filter buttons - checks sessionStorage in browser first */
    var ss = {doc: 'asc', pos: 'asc', neg: 'asc', neut: 'asc', mean: 'asc', max: 'asc', type: 'doc'};
    if (typeof Storage !== 'undefined') {
      sessionStorage.pennyFilters = JSON.stringify(ss);
      var t = ss;
      ss[t.type] = t[t.type];
      ss.type = t.type;
    }
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

  postFilteredData: function () {
    /* populates forum posts with data from filtered_data */
    /* watches these properties: filtered_data, dateFilter, pageCount */
    var data = _.sortBy(this.get('filtered_data'), 'date').reverse();
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
  }.property('filtered_data', 'pageCount'),

  redraw: function () {
    /* redraw time lines and forum messages */
    /* numPosters is used by size in the ES query */
    var _this = this;
    var data = {
      cik: this.controllerFor('detail').get('model.cik'),
      date_filter: this.get('dateFilter'),
      search_term: this.get('searchTerm'),
      sentiment: {type: this.get('sentiment'), score: 0.5},
      sort_field: this.get('ascDesc').type === 'doc' ? 'doc_count' : this.get('ascDesc').type,
      sort_type: this.get('ascDesc')[this.get('ascDesc').type],
      min_doc: 1,
      size: this.get('numOfPosters')
    };

    if (data.sort_field === 'max' || data.sort_field === 'avg' || data.sort_field === 'min') {
      data['query_size'] = 0;
    } else {
      data['query_size'] = data.size;
    }

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

      console.log('TLDATA ::', response.tlData);

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

    var renderAll = function (_this) {
      // Time series
      var topX = _.pluck(data, 'id');
      _this.set('topX', topX);
      _this.redraw();
    };

    this.renderCharts(forumData, pvData);
    renderAll(_this);
  },

  toggleSplitByFilterMember (id) {
    /* toggles which users are seen in the forum messages */
    var xFilter = this.get('splitByFilter');

    if (_.contains(xFilter, id)) {
      this.set('splitByFilter', _.without(xFilter, id));
    } else {
      this.set('splitByFilter', _.union(xFilter, [id]));
    }
  },

  renderX () {
    /* sets up data and then uses makeTimeSeries to draw all
     * users and their timelines
     */
    var _this = this;
    var model = this.get('model.tlData');

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
        'id': '#ts-' + v.id,
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
        _this.ChartsObj.makeTimeSeries(t, {
          'xmin': xmin,
          'xmax': xmax,
          'ymax': t.max,
          'ymin': 0
        });
      });
    });
  },

  renderGauges () {
    /* loads data used for drawing gauges and then passes that data to drawGauge */
    var _this = this;
    var data = this.get('model.tlData');

    Ember.run.next(function () {
      _.map(data, function (x) {
        return _this.ChartsObj.drawGauge('#gauge-' + x.id, x.pred_data);
      });
    });
  }, // This should really be broken apart

  renderCharts: function (forumData, pvdata) {
    /* renders Post Volume, Brush, Price, and Trading Volume charts */
    // date formatting functions
    var dateDomain = this.brushChart.brush.extent();
    d3.select('g.x.brush').remove();

    // draw brush chart
    this.ChartsObj.makeBarChart(this.brushChart, forumData, [new Date('2004-01-01'), new Date()]);

    // set inital date ranges to be shown
    if (dateDomain[0] < new Date('2004-01-01')) {
      this.brushChart.brush.extent(d3.extent(forumData, function (d) { return d.date; }));
    } else {
      this.brushChart.brush.extent(dateDomain);
    }

    this.brushChart.brush(d3.select('.brush').transition());
    this.rtDraw(pvdata, forumData);
  },

  sortPosters: function (sortType) {
    /* sets variables and lets renderX and renderGauges render by sort type */
    var ascdesc = JSON.parse(sessionStorage.pennyFilters);

    ascdesc[sortType] = ascdesc[sortType] === 'desc' ? 'asc' : 'desc';
    ascdesc.type = sortType;
    this.set('ascDesc', ascdesc);

    sessionStorage.pennyFilters = JSON.stringify(ascdesc);
    this.set('splitByFilter', []);

    this.redraw();
  },

  setFilterDecoration: function (sortType, chevronClass) {
    /* activates/deactivates the right buttons and FA chevrons */
    var cc = this.get('ascDesc')[sortType] === 'asc' ? ['up', 'down'] : ['down', 'up'];

    Ember.$('.filter').removeClass('active');
    Ember.$('.filter-' + sortType).toggleClass('active');

    if (Ember.$(chevronClass).hasClass('fa-chevron-' + cc[0])) {
      Ember.$(chevronClass).removeClass('fa-chevron-' + cc[0]);
      Ember.$(chevronClass).toggleClass('fa-chevron-' + cc[1]);
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
        _this.set('filtered_data', _.map(response.data, function (x) {
          x.date = new Date(x.date);
          return x;
        }));
        if (!response.pvData && !response.data) { _this.set('isData', false); }
        _this.draw();
        Ember.$('.toggle').removeClass('active');
        Ember.$('.toggle-' + st).toggleClass('active');
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
        this.set('numOfPosters', (Number(num) < 1 ? 1 : Number(num)));
      }
      var ad = this.get('ascDesc');
      ad[ad.type] = ad[ad.type] === 'asc' ? 'desc' : 'asc';
      sessionStorage.pennyFilters = JSON.stringify(ad);
      this.redraw();
    },

    sortUsers: function (sortType) {
      /* handles high level sorting of time lines */
      this.sortTimelines(sortType);
    },

    ascdesc: function (btn) {
      /* handles when sentiment and posts filter buttons are pressed */
      var a = Ember.$('.filter.active').text().replace(/\n/g, '') === 'num' ? 'doc' : Ember.$('.filter.active').text().replace(/\n/g, '');

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
    con.set('sentiment', 'na');
    con.set('numOfPosters', 10);
    // set poster sort object this.ascDesc
    con.defaultAscDesc();

    var cik = this.controllerFor('detail').get('model.cik');
    App.Search.fetch_data('cik2name', {'cik': cik}).then(function (cData) {
      App.Search.fetch_data('board', {'cik': cik, 'ticker': cData.ticker, 'date_filter': con.get('dateFilter'), 'sentiment': {type: 'neut', score: 0.5}}).then(function (response) {
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

        if (!response.pvData && !model.data) { con.set('isData', false); }
        con.initChartObjects();
        con.draw();
      });
    });
  }
});

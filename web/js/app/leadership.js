// web/js/app/leadership.js

/* global Ember, App, d3, _, moment */

function fetchLeadership (args) {
  return new Ember.RSVP.Promise(function (resolve, reject) {
    Ember.$.ajax({
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      url: 'fetchLeadership',
      data: JSON.stringify({'cik': args.cik}),
      success: function (response) { resolve(response); },
      error: function (xhr, status, error) { console.log('Error: ' + error.message); }
    });
  });
}

App.LeadershipRoute = Ember.Route.extend({
  model: function () {
    var cik = this.modelFor('detail').get('cik');
    return fetchLeadership({'cik': cik});
  },
  setupController: function (con, model) {
    con.set('model', model);
  }
});

App.LeadershipController = Ember.Controller.extend({});

App.LeadershipView = Ember.View.extend({
  e: undefined,
  templateName: 'leadership',
  didInsertElement: function () {
    if (this.get('controller.model.dates').length > 0) {
      this.make_chart(this.get('controller.model.dates'), this.get('controller.model.posNames'));
    } else {
      this.set('controller.no_data', true);
    }
  },
  make_chart: function (data, posNames) {
    var self = this;
    moment().format();

    console.log('data in make_chart leadership', data);

    data.forEach(function (d) {
      d.pos = posNames.map(function (pos) {
        var value = {};
        _.map(_.keys(d[pos]), function (key) {
          value[key] = new Date(d[pos][key]);
        });
        var out = {pos: pos, value: value};
        console.log('out', out);
        return out;
      });
    });

    var margin = { top: 50, right: 50, bottom: 50, left: 150 };
    var width = 800 - margin.left - margin.right;
    var height = 800 - margin.top - margin.bottom;

    var x0 = d3.scale.ordinal().rangeRoundBands([0, height], 0.1);
    var x1 = d3.scale.ordinal();

    var minDate = moment(_.chain(data).pluck('pos').flatten().pluck('value').pluck('start').min().value()).subtract(1, 'month');
    var maxDate = moment(_.chain(data).pluck('pos').flatten().pluck('value').pluck('stop').max().value()).add(1, 'month');

    var y = d3.time.scale().domain([minDate, maxDate]).range([width, 0]);

    var color = d3.scale.ordinal().range(['#98abc5', '#ff8c00', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c']);
    var xAxis = d3.svg.axis().scale(x0).orient('left');
    var yAxis = d3.svg.axis().scale(y).orient('top');

    var svg = d3.select('#chart').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .html(function (d) {
        return '<span>' + d.pos + ' ' + d.value.start + '</span>';
      });
    svg.call(tip);

    x0.domain(data.map(function (d) { return d.name; }));
    x1.domain(posNames).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([maxDate, minDate]);

    svg.append('g')
      .attr('class', 'x axis')
      .call(yAxis);

    svg.append('g')
      .attr('class', 'y axis')
      .call(xAxis);

    var state = svg.selectAll('.state')
      .data(data)
      .enter().append('g')
      .attr('class', 'g')
      .attr('class', 'person')
      .attr('transform', function (d) { return 'translate(0, ' + x0(d.name) + ')'; });

    state.selectAll('rect')
      .data(function (d) { return d.pos; })
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('state', function (d) { return d.name; })

      .attr('y', function (d) { return x1(d.pos); })
      .attr('x', function (d) { return y(d.value.start); })
      .attr('width', function (d) {
        var h = y(d.value.stop) - y(d.value.start);
        if (isNaN(h)) {
          h = 0;
        } else if (h === 0) {
          h = 5;
        }
        return h;
      })
      .attr('height', x1.rangeBand())

      .style('fill', function (d) { return color(d.pos); })
      .on('mouseover', function (e) {
        self.set('e', e);
      })
      .on('click', function (e) { console.log('did click ', e); });

    state.selectAll('.vline')
      .data(data).enter()
      .append('line')
      .attr('y1', function (d, i) { return 0; })
      .attr('y2', function (d, i) { return 0; })
      .attr('x1', function (d) { return 0; })
      .attr('x2', function (d) { return width; })
      .style('stroke', '#eee');
    state.selectAll('.vline')
      .data(data).enter()
      .append('line')
      .attr('y1', function (d, i) { return x0.rangeBand(); })
      .attr('y2', function (d, i) { return x0.rangeBand(); })
      .attr('x1', function (d) { return 0; })
      .attr('x2', function (d) { return width; })
      .style('stroke', '#eee');
    state.selectAll('.vline')
      .data(data).enter()
      .append('line')
      .attr('y1', function (d, i) { return 0; })
      .attr('y2', function (d, i) { return x0.rangeBand(); })
      .attr('x1', function (d) { return 0; })
      .attr('x2', function (d) { return 0; })
      .style('stroke', '#eee');
    state.selectAll('.vline')
      .data(data).enter()
      .append('line')
      .attr('y1', function (d, i) { return 0; })
      .attr('y2', function (d, i) { return x0.rangeBand(); })
      .attr('x1', function (d) { return width; })
      .attr('x2', function (d) { return width; })
      .style('stroke', '#eee');

    d3.select('#d3inp').on('change', function () {
      console.log('chaining');
      var xs = x0.domain(data.sort(this.checked
        ? function (a, b) { console.log('is checked'); return d3.descending(a.name, b.name); }
        : function (a, b) { console.log('is not checked'); return d3.ascending(a.name, b.name); })
        .map(function (d) { console.log('d.name', d.name); return d.name; }))
        .copy();
      var transition = svg.transition().duration(750);
      // var delay = function (d, i) { return i * 50; }

      transition.selectAll('.person')
        .attr('transform', function (d) { return 'translate(0, ' + xs(d.name) + ')'; });

      transition.select('.y.axis')
        .call(xAxis)
        .selectAll('g');
    });
  }
});

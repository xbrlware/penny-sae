// web/js/app/routes/app/boards.js
'use strict';

/* global Ember, App, _ */

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
      App.Search.fetch_data('board', {'cik': cik, 'ticker': cData.ticker, 'date_filter': con.get('dateFilter'), 'sentiment': {type: 'na', score: 0.5}}).then(function (response) {
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

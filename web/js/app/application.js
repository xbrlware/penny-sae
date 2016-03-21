// web/js/app/application.js

App = Ember.Application.create();

App.Router.map(function() {
    this.resource('frontpage', {path: '/'}, function () {})
    this.resource('sidebar', {path: '/sidebar/:st'}, function() {
        this.resource('detail', {path: 'detail/:cik'}, function() {
            this.resource('pvChart',     function() {})
            this.resource('googleNews',  function() {
                this.resource('subNews', function() {})
                this.resource('omxNews', {path: "omxNews/:omx"}, function() {})
            })
            this.resource('previousReg', function() {})
            this.resource('financials',  function() {})
            this.resource('delinquency', function() {})
            this.resource('associates',  function() {
                this.resource('ner', function() {})
            })
            this.resource('promotions',  function() {})
            this.resource('leadership',  function() {})
        });
        this.resource('topic', {path: 'topic'}, function() {});
    });
});

// --

App.Toggles = Ember.Object.extend({
    financials    : gconfig.DEFAULT_TOGGLES.financials,
    delta         : gconfig.DEFAULT_TOGGLES.delta,
    trading_halts : gconfig.DEFAULT_TOGGLES.trading_halts,
    delinquency   : gconfig.DEFAULT_TOGGLES.delinquency,
    network       : gconfig.DEFAULT_TOGGLES.network,
    pv            : gconfig.DEFAULT_TOGGLES.pv,
    crowdsar      : gconfig.DEFAULT_TOGGLES.crowdsar
});

App.ApplicationRoute = Ember.Route.extend({
    actions : {
        companySearch: function(searchTerm) {
            if(searchTerm) { this.transitionTo('sidebar', searchTerm); }
        }
    }
});

App.ApplicationController = Ember.Controller.extend({
    searchTerm       : undefined,
    showNav          : false,
    rf               : gconfig.DEFAULT_RF,
    toggles          : App.Toggles.create(),
    
    search_company : function(cb) {
        App.Search.search_company(this.searchTerm, rf_clean_func(this.rf, undefined)).then(cb);
    },
    search_filter : function(cb) {
        App.Search.search_filters(rf_clean_func(this.rf, this.toggles), undefined, undefined).then(cb);
    }
});

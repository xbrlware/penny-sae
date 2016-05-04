// web/js/app/application.js

/* Setup Authorization */

window.ENV = window.ENV || {};
console.log('setting up authentication...');
window.ENV['simple-auth'] = {
  authorizer                  : 'authorizer:custom',
  routeAfterAuthentication    : 'frontpage',
  routeIfAlreadyAuthenticated : 'frontpage',
  applicationRootUrl          : 'login'
};

Ember.Application.initializer({
  name   : 'authentication',
  before : 'simple-auth',
  initialize: function(container, application) {
    container.register('authenticator:custom', App.NodesecAuthenticator);
    container.register('authorizer:custom', App.NodesecAuthorizer);
  }
});

App = Ember.Application.create({
  // for development only, remove for production
  LOG_TRANSITIONS: true,
    // Global getters for localstorage
  isAdmin : function() {
    return window.localStorage.getItem('isAdmin') === 'true';
  },
  username : function() {
    return window.localStorage.getItem('username');
  },
  token : function() {
    return window.localStorage.getItem('token');
  },

  saveToken : function(token, isAdmin, username) {
    // Save to local storage
    window.localStorage.setItem('token',    token);
    window.localStorage.setItem('isAdmin',  isAdmin);
    window.localStorage.setItem('username', username);
    // Set headers
    Ember.$.ajaxSetup({headers : { 'x-access-token': token }});
  },

  updateToken : function(token, callback) {
    // Save to local storage
    window.localStorage.setItem('token', token);

    // Set headers
    Ember.$.ajaxSetup({headers : { 'x-access-token': token }});
    Ember.run(function() {
        callback();
    });
  }
});

App.GRoute = Ember.Route.extend(SimpleAuth.AuthenticatedRouteMixin);

App.Router.map(function() {
  this.route('login');
  this.resource('frontpage', {path: '/'}, function () {});
  this.resource('sidebar', {path: 'sidebar/:st'}, function() {
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

App.ApplicationRoute = Ember.Route.extend(SimpleAuth.ApplicationRouteMixin,{
  actions : {
    companySearch: function(searchTerm) {
      if(searchTerm) { this.transitionTo('sidebar', searchTerm); }
    },
    invalidateSession: function() {
      this.get('session').invalidate();
    }
  }
});

App.ApplicationController = Ember.Controller.extend({
  searchTerm : undefined,
  showNav    : false,
  rf         : gconfig.DEFAULT_RF,
  toggles    : App.Toggles.create(),

  search_company : function(cb) {
    App.Search.search_company(this.searchTerm, rf_clean_func(this.rf, undefined)).then(function(x) {console.log('x', x), cb(x)});
  },
  search_filter : function(cb) {
    App.Search.search_filters(rf_clean_func(this.rf, this.toggles), undefined, undefined).then(cb);
  }
});

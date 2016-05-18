// web/js/app/application.js

/* Setup Authorization */

window.ENV = window.ENV || {}
window.ENV['simple-auth'] = {
  authorizer: 'authorizer:custom',
  routeAfterAuthentication: 'frontpage',
  routeIfAlreadyAuthenticated: 'frontpage',
  applicationRootUrl: 'login'
}

Ember.Application.initializer({
  name: 'authentication',
  before: 'simple-auth',
  initialize: function (container, application) {
    container.register('authenticator:custom', App.NodesecAuthenticator)
    container.register('authorizer:custom', App.NodesecAuthorizer)
  }
})

App = Ember.Application.create({
  // for development only, remove for production
  LOG_TRANSITIONS: true,
  // Global getters for localstorage
  isAdmin: function () {
    return window.localStorage.getItem('isAdmin') === 'true'
  },
  username: function () {
    return window.localStorage.getItem('username')
  },
  token: function () {
    return window.localStorage.getItem('token')
  },

  saveToken: function (token, isAdmin, username) {
    // Save to local storage
    window.localStorage.setItem('token', token)
    window.localStorage.setItem('isAdmin', isAdmin)
    window.localStorage.setItem('username', username)
    // Set headers
    Ember.$.ajaxSetup({headers: { 'x-access-token': token }})
  },

  updateToken: function (token, callback) {
    // Save to local storage
    window.localStorage.setItem('token', token)

    // Set headers
    Ember.$.ajaxSetup({headers: { 'x-access-token': token }})
    Ember.run(function () {
      callback()
    })
  }
})

App.GRoute = Ember.Route.extend(SimpleAuth.AuthenticatedRouteMixin)

App.Router.map(function () {
  this.route('login')
  this.resource('frontpage', {path: '/'}, function () {})
  this.resource('sidebar', {path: 'sidebar/:st'}, function () {
    this.resource('detail', {path: 'detail/:cik'}, function () {
      this.resource('pvChart', function () {})
      this.resource('googleNews', function () {
        this.resource('subNews', function () {})
        this.resource('omxNews', {path: 'omxNews/:omx'}, function () {})
      })
      this.resource('previousReg', function () {})
      this.resource('financials', function () {})
      this.resource('delinquency', function () {})
      this.resource('associates', function () {
        this.resource('ner', function () {})
      })
      this.resource('promotions', function () {})
      this.resource('leadership', function () {})
    })
    this.resource('topic', {path: 'topic'}, function () {})
  })
})

// --

App.RedFlagParams = Ember.Object.extend({
  _params: gconfig.DEFAULT_REDFLAG_PARAMS,
  _toggles: gconfig.DEFAULT_TOGGLES,
  get_params: function () { return this.get('_params'); },
  get_toggles: function () { return this.get('_toggles'); },
  get_toggled_params: function () {
    var params = this.get('_params')
    var toggles = this.get('_toggles')
    return _.chain(params).pairs().filter(function (x) { return toggles[x[0]]}).object().value()
  }
})

App.ApplicationRoute = Ember.Route.extend(SimpleAuth.ApplicationRouteMixin, {
  actions: {
    companySearch: function (searchTerm) {
      if (searchTerm) { this.transitionTo('sidebar', searchTerm); }
    },
    invalidateSession: function () {
      this.get('session').invalidate()
    }
  }
})

App.ApplicationController = Ember.Controller.extend({
  searchTerm: undefined,
  showNav: false,
  redflag_params: App.RedFlagParams.create(),
  isLoading: false, // state variable for spinner

  search_company: function (cb) {
    App.Search.search_company(this.searchTerm, this.redflag_params).then(cb)
  },
  sort_companies: function (cb) {
    console.log('application -> sort_companies')
    App.Search.search_company(undefined, this.redflag_params).then(cb)
  }
})

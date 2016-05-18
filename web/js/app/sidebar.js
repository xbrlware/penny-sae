// web/js/app/sidebar.js

App.SidebarRoute = App.GRoute.extend({
  model: function (params) {
    return params
  },

  setupController: function (controller, model) {
    var app_con = this.controllerFor('application')

    controller.set('isLoading', true)
    app_con.set('showNav', true)

    if (model.st !== '-') {
      app_con.set('searchTerm', model.st)
      app_con.search_company(function (response) {
        controller.set('model', response)
        controller.set('isLoading', false)
      })
    } else {
      app_con.set('searchTerm', undefined)
      app_con.search_filter(function (response) {
        controller.set('model', response)
        controller.set('isLoading', false)
      })
    }
  },

  actions: {
    toggleFlag: function (flag) {
      var toggles = this.get('controller').get('toggles')
      toggles.get(flag) ? toggles.set(flag, false) : toggles.set(flag, true)
    },
    search_filters: function () {
      var con = this.get('controller')
      var rf = con.get('rf')
      var toggles = con.get('toggles')
      var rf_clean = rf_clean_func(rf, toggles)
      con.set('isLoading', true)
      App.Search.search_filters(rf_clean, undefined, undefined).then(function (response) {
        con.transitionToRoute('sidebar')
        con.set('model', response)
        con.set('isLoading', false)
      })
    }
  }
})

App.SidebarController = Ember.ObjectController.extend({
  needs: ['application'],
  rf: Ember.computed.alias('controllers.application.rf'),
  toggles: Ember.computed.alias('controllers.application.toggles'),
  searchTerm: Ember.computed.alias('controllers.application.searchTerm'),
  searchTerm_topic: Ember.computed.alias('controllers.application.searchTerm_topic'),
  isLoading: Ember.computed.alias('controllers.application.isLoading'),

  actions: {
    iterateSidebar: function (dir) {
      if (dir > 0) {
        this.set('from', this.get('from') + gconfig.SIZE)
      } else {
        this.set('from', Math.max(this.get('from') - gconfig.SIZE, 0))
      }

      var rf = this.get('rf')
      var toggles = this.get('toggles')
      var rf_clean = rf_clean_func(rf, toggles)

      var self = this
      self.set('isLoading', true)
      App.Search.search_filters(rf_clean, this.get('from'), this.get('model')).then(function (response) {
        self.set('model', response)
        self.set('isLoading', false)
      })
    }
  }
})

App.SidebarView = Ember.View.extend({
  willInsertElement: function () {
    Ember.$('body').css({
      'transition': 'background-color 0.5s ease-in-out',
      'background-color': 'white'
    })

    Ember.$('body').on('click.collapse-next.data-api', '[data-toggle=collapse-next]', function () {
      var $next = $(this).parent().next()
      var $others = $('.ab-sidebar')
      $others.collapse({toggle: false})
      $others.collapse('hide')
      $next.collapse('toggle')
    })
  },
  didInsertElement: function () {
    Ember.$('#big-dropdown-button').trigger('click.bs.dropdown')
  }
})

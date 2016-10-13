// web/js/app/sidebar.js

/* global Ember, App, _, alert, gconfig */

App.SidebarRoute = App.GRoute.extend({
  model: function (params) {
    return params;
  },

  renderTemplate: function () {
    this.render();
  },

  setupController: function (controller, model) {
    var appCon = this.controllerFor('application');

    controller.set('isLoading', true);
    appCon.set('showNav', true);
    if (model.st === '-') {
      appCon.set('searchTerm', undefined);
      appCon.sort_companies(function (response) {
        controller.set('model', response);
        controller.set('isLoading', false);
      });
    } else if (model.st === '--' && controller.get('model') !== null) {
      appCon.set('searchTerm', undefined);
      var ciks = _.pluck(controller.get('model').hits, 'cik');
      appCon.refresh_companies(ciks, function (response) {
        controller.set('model', response);
        controller.set('isLoading', false);
      });
    } else {
      appCon.set('searchTerm', model.st);
      appCon.search_company(function (response) {
        controller.set('model', response);
        controller.set('isLoading', false);
      });
    }
  },
  actions: {
    toggleFlag: function (flag) {
      var toggles = this.get('controller.redFlagParams').get_toggles();
      toggles.get(flag) ? toggles.set(flag, false) : toggles.set(flag, true);
    },
    sort_companies: function () {
      var controller = this.get('controller');
      var appCon = this.controllerFor('application');
      controller.set('isLoading', true);
      appCon(function (response) {
        controller.transitionToRoute();
        controller.transitionToRoute('sidebar');
        controller.set('model', response);
        controller.con.set('isLoading', false);
      });
    },
    summary_detail: function () {
      return [1, 2, 3];
    }
  }
});

App.SidebarController = Ember.ObjectController.extend({
  needs: ['application'],
  redFlagParams: Ember.computed.alias('controllers.application.redFlagParams'),
  searchTerm: Ember.computed.alias('controllers.application.searchTerm'),
  searchTopic: Ember.computed.alias('controllers.application.searchTopic'),
  isLoading: Ember.computed.alias('controllers.application.isLoading'),

  actions: {
    iterateSidebar: function (dir) {
      if (dir > 0) {
        this.set('from', this.get('from') + gconfig.SIZE);
      } else {
        this.set('from', Math.max(this.get('from') - gconfig.SIZE, 0));
      }

      this.set('isLoading', true);
      // This is what used to be implemented here:
      //      App.Search.search_filter(redFlagParams, this.get('from'), this.get('model')).then(function (response) {
      //
      alert('look at the code -- this isnt actually implemented');
      var this_ = this;
      App.Search.search_company(undefined, this.get('redFlagParams')).then(function (response) {
        this_.set('model', response);
        this_.set('isLoading', false);
      });
    }
  }
});

App.SidebarView = Ember.View.extend({
  willInsertElement: function () {
    Ember.$('body').css({
      'transition': 'background-color 0.5s ease-in-out',
      'background-color': 'white'
    });

    Ember.$('body').on('click.collapse-next.data-api', '[data-toggle=collapse-next]', function () {
      var $next = Ember.$(this).parent().next();
      var $others = Ember.$('.ab-sidebar');
      $others.collapse({toggle: false});
      $others.collapse('hide');
      $next.collapse('toggle');
    });
  },
  didInsertElement: function () {
    Ember.$('#big-dropdown-button').trigger('click.bs.dropdown');
  }
});

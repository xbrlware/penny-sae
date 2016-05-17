// web/js/app/sidebar.js

App.SidebarRoute = App.GRoute.extend({
    model : function(params) {
        return params
    },

    setupController: function(controller, model) {
        var app_con = this.controllerFor('application');

        controller.set('isLoading', true);
        app_con.set('showNav', true);

    },
    actions : {
        toggleFlag : function(flag) {
          var toggles = this.get('controller.redflag_params').get_toggles();
          toggles.get(flag) ? toggles.set(flag, false) : toggles.set(flag, true);
        },
        search_filters : function() {
          var con            = this.get('controller');
          var redflag_params = con.get('redflag_params');
          con.set('isLoading', true);
          App.Search.search_filters(redflag_params, undefined, undefined).then(function(response) {
            con.transitionToRoute('sidebar');
            con.set('model', response);
            con.set('isLoading', false);
          });
        }
    }
});

App.SidebarController = Ember.ObjectController.extend({
    needs            : ['application'],
    redflag_params   : Ember.computed.alias('controllers.application.redflag_params'),
    searchTerm       : Ember.computed.alias('controllers.application.searchTerm'),
    searchTerm_topic : Ember.computed.alias('controllers.application.searchTerm_topic'),
    isLoading        : false,

    actions : {
        iterateSidebar: function(dir) {
            if (dir > 0) {
                this.set('from', this.get('from') + gconfig.SIZE);
            } else {
                this.set('from', Math.max(this.get('from') - gconfig.SIZE, 0));
            }

      var redflag_params = this.get('redflag_params');

      var self = this;
      self.set('isLoading', true);
      App.Search.search_filters(redflag_params, this.get('from'), this.get('model')).then(function(response) {
        self.set('model', response);
        self.set('isLoading', false);
      });
    }
});

App.SidebarView = Ember.View.extend({
    willInsertElement: function() {
        Ember.$('body').css({
            "transition"       : 'background-color 0.5s ease-in-out',
            "background-color" : 'white'
        });

        Ember.$('body').on('click.collapse-next.data-api', '[data-toggle=collapse-next]', function() {
            var $next   = $(this).parent().next()
            var $others = $('.ab-sidebar')
            $others.collapse({toggle: false});
        $others.collapse('hide')
            $next.collapse('toggle');
        });
    },
    didInsertElement : function() {
        Ember.$('#big-dropdown-button').trigger('click.bs.dropdown');
    }
});

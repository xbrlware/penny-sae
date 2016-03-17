// Sidebar


App.SidebarRoute = Ember.Route.extend({

    setupController: function(controller, model) {
        this.controllerFor('application').set('showNav', true);
        controller.set('isLoading', true);
        
        var rf      = this.controllerFor('application').get('rf'),
            toggles = this.controllerFor('application').get('toggles'),
            searchTerm_onload       = this.controllerFor('application').get('searchTerm'),
            searchTerm_topic_onload = this.controllerFor('application').get('searchTerm_topic');
        
        if(searchTerm_onload) {
            App.Search.search_company(searchTerm_onload, rf_clean_func(rf, undefined)).then(function(response) {
                controller.set('model', response);
                controller.set('isLoading', false);
            });
//        } else if(searchTerm_topic_onload) {
//            promise = App.Search.search_topic(searchTerm_topic_onload, rf_clean_func(rf, undefined));
//            promise.then(function(response) {
//                controller.set('model', response);
//                controller.set('isLoading', false);
//            });
//            controller.transitionToRoute('topic');
        } else {
            controller.transitionToRoute('application');
            controller.set('isLoading', false);
        }
    },
    
    actions : {
        toggleFlag : function(flag) {
            var toggles = this.get('controller').get('toggles')
            toggles.get(flag) ? toggles.set(flag, false) : toggles.set(flag, true);
        },
        search_filters : function() {
            var con = this.get('controller');

            var rf       = con.get('rf');
            var toggles  = con.get('toggles');
            var rf_clean = rf_clean_func(rf, toggles);
            
            con.set('isLoading', true);
            App.Search.search_filters(rf_clean, undefined, undefined).then(function(response) {
                con.transitionToRoute('sidebar');
                con.set('model', response);
                con.set('isLoading', false);
            });
        }
    }
});


App.SidebarController = Ember.ObjectController.extend({
    needs            : ['application'],
    rf               : Ember.computed.alias('controllers.application.rf'),
    toggles          : Ember.computed.alias('controllers.application.toggles'),
    searchTerm       : Ember.computed.alias('controllers.application.searchTerm'),
    searchTerm_topic : Ember.computed.alias('controllers.application.searchTerm_topic'),
    isLoading   : false,
    actions : {
        iterateSidebar: function(dir) {
            if(dir > 0) {
				this.set('from', this.get('from') + gconfig.SIZE)
			} else {
				this.set('from', Math.max(this.get('from') - gconfig.SIZE, 0))
			};
            var rf       = this.get('rf');
            var toggles  = this.get('toggles');
            var rf_clean = rf_clean_func(rf, toggles);

            var self = this;
            self.set('isLoading', true);
            App.Search.search_filters(rf_clean, this.get('from'), this.get('model')).then(function(response) {
                self.set('model', response);
                self.set('isLoading', false);
            });
        }
    }
});

App.SidebarView = Ember.View.extend({
    willInsertElement: function() {
        $('body').css({
            "transition"       : 'background-color 0.5s ease-in-out',
            "background-color" : 'white'
        });
        $('body').on('click.collapse-next.data-api', '[data-toggle=collapse-next]', function() {
            var $next   = $(this).parent().next()
            var $others = $('.ab-sidebar')
            $others.collapse({toggle: false});
            $others.collapse('hide')
            $next.collapse('toggle');
        });
    },
    didInsertElement : function() {
        $('#big-dropdown-button').trigger('click.bs.dropdown');
    }
});

App.HitController = Ember.ObjectController.extend({});
App.HitView = Ember.View.extend({
    templateName : "hit"
});

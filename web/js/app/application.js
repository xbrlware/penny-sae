App = Ember.Application.create();

App.Router.map(function() {
    this.resource('frontpage', {path: '/'}, function () {}),
    this.resource('sidebar', {path: '/o'}, function() {
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

Ember.RSVP.configure('onerror', function(error) {
    if (error instanceof Error) {
        Ember.Logger.assert(false, error);
        Ember.Logger.error(error.stack);
    }
});

App.ApplicationRoute = Ember.Route.extend({
    model : function() {
        return App.RFQ.create();
    },
    setupController : function(controller, model) {
        controller.set('model', model);
    },
    actions : {
        // Functions in menu bar
        companySearch: function() {
            var con         = this.get('controller');
            var sidebar_con = this.controllerFor('sidebar');
            var searchTerm = con.get('searchTerm');
            if(searchTerm != '' & searchTerm != undefined) {
                sidebar_con.set('isLoading', true);
                var promise = App.Search.search_company(searchTerm, rf_clean_func(con.get('rf'), undefined));
                promise.then(function(response) {
                    sidebar_con.set('model', response);
                    sidebar_con.set('isLoading', false);
                });
            }
        },
        topicSearch: function() {
            var con         = this.get('controller');
            var sidebar_con = this.controllerFor('sidebar');
            var searchTerm_topic = this.get('controller').get('searchTerm_topic');
            if(searchTerm_topic != '' & searchTerm_topic != undefined) {
                sidebar_con.set('isLoading', true);
                var promise = App.Search.search_topic(searchTerm_topic, rf_clean_func(con.get('rf'), undefined));
                promise.then(function(response) {
                    con.transitionToRoute('topic');
                    sidebar_con.set('model', response);
                    sidebar_con.set('isLoading', false);
                });
            }
        },
        run_search_filters_from_application: function () {
            this.controllerFor('sidebar').send('run_search_filters');
        }
    }
});
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

App.ApplicationRoute = Ember.Route.extend({
    model : function() {
        return App.RFQ.create();
    },
    setupController : function(controller, model) {
        controller.set('model', model);
    },
    actions : {
        // Running company search from the top bar
        companySearch: function() {
            console.log('companySearch -- application');
            var rf          = this.get('controller.rf'),
                searchTerm  = this.get('controller.searchTerm'),
                sidebar_con = this.controllerFor('sidebar');
            
            if(searchTerm) {
                sidebar_con.set('isLoading', true);
                App.Search.search_company(searchTerm, rf_clean_func(rf, undefined)).then(function(response) {
                    sidebar_con.set('model', response);
                    sidebar_con.set('isLoading', false);
                });
            }
        },
//        search_filters: function () {
//            this.controllerFor('sidebar').send('search_filters');
//        }
    }
});

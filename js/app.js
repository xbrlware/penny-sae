App = Ember.Application.create();

// Global Variables
var QUERY_DATABASE = [];
var SIZE           = 25;
var SERVER_PORT    = 7070
var SERVER_PATH    = "http://localhost:" + SERVER_PORT + "/"
//var SERVER_PATH = "http://184.72.165.94:" + SERVER_PORT  + "/"

var HIGH_RISK_THRESH = 85;
var LOW_RISK_THRESH  = 75;
var MAX_RISK         = 40;

var RES_THRESH = 2;

var NETWORK_EDGE_COLOR = 'lightgrey';
var NETWORK_EDGE_WIDTH = 1;

Ember.RSVP.configure('onerror', function(error) {
    if (error instanceof Error) {
        Ember.Logger.assert(false, error);
        Ember.Logger.error(error.stack);
    }
});

// ---------- Communication with Server ---------------
// I imagine this could be done in a more native way...

function fetch_companies(args){
    $.ajax({
        type    : 'POST',
        dataType: 'json',
        url     : SERVER_PATH + 'fetch_companies',
        data    : JSON.stringify({
                    "index"      : args.index,
                    "query_type" : args.query_type,
                    "query_args" : args.query_args,
                    "from"       : args.from}),
        success : args.callback,
        error   : function (xhr, status, error) {
                    console.log('Error: ' + error.message);
                  }
    });
}

function sar_generator(args){
    var cik = args.source.company_data.cik[0];
    console.log(cik);
    console.log('sending', args)
    $.ajax({
        type    : 'POST',
        dataType: 'json',
        url     : SERVER_PATH + 'sar_generator',
        data    : JSON.stringify({ "cik" : cik }),
        success : args.callback,
        error   : function (xhr, status, error) {
                    console.log('Error: ' + error.message);
                  }
    });
}


// -----------------------------------------------------


// ES only takes queries from same machine
// Node.js takes queries from everywhere, but has limited interface

function getDetail(cik, filters) {
    console.log('calling getDetail...');
    return new Ember.RSVP.Promise(function(resolve, reject) {
        fetch_companies({
            query_type : "detailQuery",
            query_args : [cik, filters],
            index      : 'companies',
            callback   : function(data) {
                var x = data.hits.hits[0]
                var c = App.CompanyData.create();
                c.set('cik', x._id);
                c.set('source', x._source);
                c.set('fields', x.fields);
                resolve(c);
            }
        });
    });
}

function getRiskStyle(risk_quant, risk_prob){
    var color = risk_quant > HIGH_RISK_THRESH ? 'red' : (risk_quant < LOW_RISK_THRESH ? 'green' : 'yellow')

    str = '\
        background: -webkit-linear-gradient(' + color + ', white); /* For Safari 5.1 to 6.0 */\
        background: -o-linear-gradient(' + color + ', white); /* For Opera 11.1 to 12.0 */\
        background: -moz-linear-gradient(' + color + ', white); /* For Firefox 3.6 to 15 */\
        background: linear-gradient(' + color + ', white); /* Standard syntax */\
    '
    
    var style = new Object;
    style.meter   = "background-color:" + 'lightgrey' + "; height:" + (100 - risk_prob) + "%;";
    style.wrapper = str;
    return style
}
// -------------------------------------------------
// --------------- OBJECTS -------------------------
// -------------------------------------------------
App.Splash = Ember.Object.extend({
    total_hits : undefined,
    hits       : [],
    from       : 0,
    type       : 'risk',
    goBack     : function() { return this.get('from') > 0; }.property('from'),
    goForward  : function() { return this.get('from') + SIZE < this.get('total_hits'); }.property('from', 'total_hits'),
    updateRisk : function () {
        var from = this.get('from');
        console.log('from update', from)
    }.property('from')
});

App.Splash.reopenClass({
    getRisk : function(type) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            fetch_companies({
                query_type : "splashQuery",
                query_args : [type],
                index      : 'companies',
                from       : 0,
                callback   : function (data) {
                    var s = App.Splash.create();
                    console.log('--- data from getRisk', data);
                    s.set('type', type);
                    s.set('total_hits', data.hits.total);
                    s.set('hits', data.hits.hits.map(function(x){
                        var ret = {
                            "cik"         : x._id,
                            "currentName" : x.fields.currentName,
                            "risk_quant"  : Math.round(x._source.risk.risk_quant * 10) / 10,
                            "risk_prob"   : Math.round(x._source.risk.risk_prob * 1000) / 10
                        }
                        ret.risk = {"risk_quant" : ret.risk_quant, "risk_prob" : ret.risk_prob};
                        return ret;
                    }));
                    resolve(s);
                }
            });
        });
    }
});

// --- Query ---
App.Query = Ember.Object.extend({
    id        : '',
    name      : '',
    filters   : [],
    from      : 0,
    isLoading : false,
    results   : null   // App.ESR
})

App.Query.reopenClass({
    createQuery: function(name) {
        var query = App.Query.create({name : name});
        query.set('filters', []);
        query.set('results', App.ESR.create());
        return query;
    },
    companyDetail: function(q, cik) {
        var comp = q.results.companies;
        for(i=0; i < comp.length; i++){
            if(comp[i].get('cik') == cik){
                return comp[i];
            }
        }
    }
});

// ---- Filter ----
App.Filter = Ember.Object.extend({
    id    : '',
    type  : '',
    value : null,

    // Determine type of filter for UI
    isDelta: function() {
        var ret = this.type == 'delta' ? true : false; return ret;
    }.property('type'),
    isName: function() {
        var ret = this.type == 'name' ? true : false; return ret;
    }.property('type'),
});

App.ESR = Ember.Object.extend({
    total     : '',
    companies : []
});

App.CompanyData = Ember.Object.extend({
    cik    : '',
    score  : null,
    source : null,
    fields : null,
    rgraph : null,

    cse_url    : function() {
        var currentName = this.get('currentName');
        console.log('currentName', currentName);
        return 'cse.html?q="' + currentName + '"';
    }.property('currentName'),

    smartTenK: function() {
        var tenk = this.get('source.tenk');
        if(Object.keys(tenk).length > 1){
            var out = [];
            for(i=0; i < tenk.date.length; i++){
                out.push({
                    "date"   : tenk.date[i],
                    "change" : tenk.delta[i] || 0
                });
            }
            return out;
        } else {
            return false;
        }
    }.property('source'),
    
    allForum: function() {
        return allForum( this.get('cik'), this.get('currentName'), this.get('source').forum );
    }.property('source'),
    
    // Current name of company
    currentName: function(){
        return this.get('fields.currentName');
    }.property('fields'),
    
    n_records: function(){
        return this.get('fields.n_records');
    }.property('fields'),
    
    // Header information for table
    companyTable: function(){
        var d = this.get('source.company_data');
        tab = [];
        for(i=0; i < d.cik.length; i++){
            var obj   = new Object;
            obj.date  = d.date == undefined ? undefined : d.date[i],
            obj.name  = d.company_name == undefined ? undefined : d.company_name[i],
            obj.sic   = d.sic == undefined ? undefined : d.sic[i],
            obj.state = d.state_of_incorporation == undefined ? undefined : d.state_of_incorporation[i];
            tab.push(obj)
        }
        return(tab)
    }.property('source'),
    
    // Trading halt information for table
    tradingHalt: function() {
        var th = this.get('source.th');
        if(Object.keys(th).length > 1){
            var out = [];
            for(i=0; i<th.date.length; i++){
                var url = th.url[i];
                out.push({"date" : th.date[i], "url" : "http://www.sec.gov" + url})
            }
            return out;
        } else {
            return null;
        }
    }.property('source'),
    
    // PVA information for table
    spikesTable: function() {
        var s = this.get('fields.spike');
        if(s != undefined){
            s   = s[0];
            tab = [];
            for(i=0; i < s.spike_size.length; i++){
                var obj = {
                    spike_date: s.spike_dates[i],
                    spike_size: s.spike_size[i],
                    spike_from: s.spike_from[i],
                    spike_to:   s.spike_to[i],
                    spike_vol:  s.spike_vol[i]
                }
                tab.push(obj);
            }
            return(tab);
        } else {
            return null;
        }
    }.property('fields'),
    
    risk: function() {
        if(this.get('source') != null) {
            var ths = this.get('source');
            return {
                "risk_score" : ths.risk.risk_score[0],
                "risk_quant" : Math.round(ths.risk.risk_quant[0] * 10) / 10,
                "risk_prob"  : Math.round(ths.risk.risk_prob[0] * 1000) / 10
            }
        } else {
            var ths = this.get('fields');
            return {
                "risk_score" : ths['risk.risk_score'][0],
                "risk_quant" : Math.round(ths['risk.risk_quant'][0] * 10) / 10,
                "risk_prob"  : Math.round(ths['risk.risk_prob'][0] * 1000) / 10
            }
        }
        console.log(" ---------------- ths", ths)
    }.property('source', 'fields'),
    
    style: function() {
        var risk = this.get('risk'); console.log('risk', risk);
        return getRiskStyle(risk.risk_quant, risk.risk_prob);
    }.property('risk'),
    
    sarreport : null
});

// -------------------------------------------------
// -------------- END OBJECTS ----------------------
// ----------------------------------------------------------------------------------------------------------------------------------

App.Router.map(function() {
    this.resource('queries', {path: '/'}, function() {
        this.resource('query', {path: '/:name' }, function() {
            this.route('filts');
            this.resource('results', function() {});
        });
    });
    this.resource('detail', {path: 'detail/:cik'}, function() {});
});

App.IndexRoute = Ember.Route.extend({beforeModel: function() {this.transitionTo('queries');}});

App.QueriesRoute = Ember.Route.extend({
    model: function() {
        return QUERY_DATABASE
    },
    actions: {
        addQuery: function() {
            var name = this.get('controller').get('newName');
            if(name == '' || name == undefined){
                var d = new Date();
                name = 'q_' + d.getTime() % 86400;
            }
            var query = App.Query.createQuery(name);
            this.modelFor('queries').pushObject(query);
            this.get('controller').set('newName', '');
            this.transitionTo('query.filts', query);
        },
        runQuery: function() {
            this.controllerFor('query').send('runQuery');
        },
        iterateQuery: function(dir) {
            this.controllerFor('query').send('iterateQuery', dir);
        },
        // This is relatively thrown together, so it might be buggy...
        quickSearch: function() {
            console.log(this.controllerFor('queries').get('searchType'))
            if(this.controllerFor('queries').get('searchType') == 'company'){
                var newQS = this.controllerFor('queries').get('newQS');
                if(newQS != '' & newQS != undefined){
                    var d = new Date();
                    var name  = newQS.replace(/\s+/g, '-');
                    var query = App.Query.createQuery(name);
                    
                    var filter = App.Filter.create();
                    filter.set('id', 1);
                    filter.set('type', "name");
                    filter.set('value', Ember.Object.create({name : newQS}))
                    query.filters.pushObject(filter);
                    
                    this.modelFor('queries').pushObject(query);
                    this.controllerFor('query').send('runQuery', query);
                    this.transitionTo('results', query);
                }
            } else {
                // Individual Search
            }
        }
    }
});

App.QueriesIndexRoute = Ember.Route.extend({
    model: function(params) {
        var con = this.get('controller');
        if(con != undefined)
            var mod = App.Splash.getRisk(con.get('splashType'))
        else
            var mod = App.Splash.getRisk('volume');
        return mod;
    },
    setupController: function(controller, model) {
        controller.set('model', model);
    },
    actions: {
        goToDetail : function(cik) {
            this.transitionToRoute('detail', cik);
        },
        changeSplashType : function (newSplashType) {
            console.log('old splash type', this.get('controller').get('splashType'))
            var new_mod_promise = App.Splash.getRisk(newSplashType);
            that = this;
            new_mod_promise.then(function(new_mod){
                that.get('controller').set('model', new_mod);
                that.get('controller').set('splashType', newSplashType)
            })
        }
    }
});

App.QueryRoute = Ember.Route.extend({
    beforeModel: function() {if(QUERY_DATABASE.length == 0) this.transitionTo('queries');}
})

// Query Filters
/*
App.QueryFiltsRoute = Ember.Route.extend({
    beforeModel: function() { if(QUERY_DATABASE.length == 0) this.transitionTo('queries');},
    model: function() {
        return this.modelFor('query').get('filters');
    },
    setupController: function(controller, model) {
        this._super(controller, model);
        controller.set('query', this.modelFor('query'));
    },
    actions: {
        addFilter: function() {
            var filter = App.Filter.create();
            
            var filts = this.modelFor('query.filts');
            var max = 0;
            filts.forEach(function(x){ max = x.id > max ? x.id : max; });
            filter.set('id', max + 1);
            
            var type = this.controller.get('filterType');
            filter.set('type', type);
            filter.set('value', Ember.Object.create())
            filts.pushObject(filter);
        },
        removeFilter: function(id) {
            var filts = this.modelFor('query.filts');
            filts.removeObject(filts.findBy('id', id));
        },
        runQuery: function() {
            this.controllerFor('query').send('runQuery');
            this.transitionTo('results');
        }
    }
});
*/

App.ResultsRoute = Ember.Route.extend({
    beforeModel: function() {if(QUERY_DATABASE.length == 0) this.transitionTo('queries');},
    model: function() {
        return this.modelFor('query');
    },
    actions : {
        backToHome : function () {
            this.transitionTo('/');
        }
    }
});

App.DetailRoute = Ember.Route.extend({
    model: function(params) {
        var filters = this.modelFor('query') != undefined ? this.modelFor('query').filters : undefined;
        var mod     = getDetail(params.cik, filters);
        console.log(mod);
        return mod;
    },
    setupController : function(controller, model, queryParams){
        controller.set('model', model);
        sar_generator({
            "currentName"  : model.get('currentName'),
            "companyTable" : model.get('companyTable'),
            "source"       : model.get('source'),
            "tradingHalt"  : model.get('tradingHalt'),
            callback       : function(x) {
                controller.set('sarreport', x.sar);
            }
        });
    },
    actions: {
        backToResults: function() { this.transitionTo('results', this.modelFor('query')); },
        backToHome : function ()  { this.transitionTo('/'); },
        setRgraph: function(json) {
            if(json != undefined){              // This is copying data...
                json.forEach(function(x){
                    var d      = x.data;
                    x.isOwner  = d.type == 'owner';
                    x.type     = d.type;
                    x.depth    = d.depth;
                    x.terminal = d.terminal;
                    x.otc      = d.otc;
                });
                this.modelFor('detail').set('rgraph', json);
            }
        }
    }
})


// ---------------------
// ---- Controllers ----
// ----------------------------------------------------------------------------------------------------------

App.QueriesIndexController = Ember.ObjectController.extend({
    splashType : 'volume',
    splashTypeIsVolume : function() {
        return this.get('splashType') == 'volume' ? true : false;
    }.property('splashType'),
    actions : {
        iterateSplash: function(dir) {
            dir > 0 ? this.set('from', this.get('from') + SIZE) : this.set('from', Math.max(this.get('from') - SIZE, 0));
            this.send('runSplash')
        },
        runSplash : function() {
            var s = this.get('model')
            var splashType = this.get('splashType')
            console.log(s)
            s.set('isLoading', true);
            var from = s.get('from');
            return new Ember.RSVP.Promise(function(resolve, reject) {
                fetch_companies({
                    query_type : "splashQuery",
                    query_args : [splashType],
                    index      : 'companies',
                    from       : from,
                    callback   : function(data) {
                        console.log(data);
                        s.set('total_hits', data.hits.total);
                        s.set('hits', data.hits.hits.map(function(x){
                            var ret = {
                                "cik"         : x._id,
                                "currentName" : x.fields.currentName,
                                "risk_quant"  : Math.round(x._source.risk.risk_quant * 10) / 10,
                                "risk_prob"   : Math.round(x._source.risk.risk_prob * 1000) / 10
                            }
                            ret.risk = {"risk_quant" : ret.risk_quant, "risk_prob" : ret.risk_prob}
                            return ret;
                        }));
                        resolve(s);
                    }
                });
            });
        }
    }
});

App.QueriesController = Ember.Controller.extend({
    searchType: "company",
    searchTypes: [{label: "Search Company Name, Ticker or CIK", id: "company"}, {label: "Individual", id: "individual"}]
})

// I think the back problem would be solved by moving "runQuery" to model -- query doesn't have a model right now...
App.QueryController = Ember.ObjectController.extend({
    actions: {
        runQuery: function(q) {
            q = q == undefined ? this.get('model') : q;
            q.set('isLoading', true);
            var from = q.get('from');
            
            return new Ember.RSVP.Promise(function(resolve, reject) {
                fetch_companies({
                    query_type : "resultsQuery",
                    query_args : [q],
                    index      : 'companies',
                    from       : from,
                    callback   : function(data) {
                        var esr = App.ESR.create();
                        var arr = [];
                        var last_score = -1;
                        var broke = false;
                        var counter = 0;
                        data.hits.hits.forEach(function(x){
                            var score = Math.round(100 * x._score) / 100
                            if(last_score / score <= RES_THRESH) {
                                counter++
                                var c = App.CompanyData.create();
                                c.set('cik', x._id);
                                c.set('fields', x.fields);
                                c.set('score', score)
                                last_score = score;
                                arr.push(c);
                            } else {
                                broke = true;
                            }
                        });
                        
                        broke == true ? esr.set('total', q.get('from') + counter) : esr.set('total', data.hits.total);
                        
                        esr.set('companies', arr);
                        q.set('results', esr);
                        q.set('isLoading', false);
                        resolve(esr);
                      }
                });
            });
        },
        iterateQuery: function(dir) {
            var q = this.get('model');
            dir > 0 ? q.set('from', q.get('from') + SIZE) : q.set('from', Math.max(q.get('from') - SIZE, 0));
            this.send('runQuery');
        }
    }
});

App.ResultsController = Ember.ObjectController.extend({
    goBack    : function() { return this.get('from') > 0; }.property('from'),
    goForward : function() { return this.get('from') + SIZE < this.get('results.total'); }.property('from', 'results.total')
});

App.DetailController = Ember.ObjectController.extend({
    vis_center    : null,
    query_name    : null,
    ht            : false,
    rgraph_object : null
});


// -------------------------------------------
// ------ Components and Animations ----------
// ---------------------------------------------------------------------------------------------------------
App.QueriesView = Ember.View.extend({
    didInsertElement : function () {
        $('html, body').animate({ scrollTop: 0 }, 0);
    }
});

App.BannerView = Ember.View.extend({
    templateName: "banner"
});

App.SplashitemView = Ember.View.extend({
    templateName: "splashitem",
    hover: false,
    didInsertElement : function() {
        var that = this;
        this.$().on('mouseover', '.splash-chart-wrapper', function() {
            that.set('hover', true);
        }).on('mouseout', '.splash-chart-wrapper', function() {
            that.set('hover', false)
        });
    }
});

App.SplashdetailView = Ember.View.extend({
    templateName: "splashdetail",
    didInsertElement: function(){
        this._super();
        this.$().hide().show(50)
    },
    willDestroyElement: function() {
        var clone = this.$().clone();
        this.$().parent().append(clone);
        clone.fadeOut();
    }
});

App.ResultitemView = Ember.View.extend({
    templateName: "resultitem",
    hover: false,
    mouseEnter: function() {
        console.log('hover')
        this.set('hover', true);
    },
    mouseLeave: function() {
        console.log('unhover')
        this.set('hover', false);
    }
});

App.DonutView = Ember.View.extend({
    render: function(buffer) {
        var risk = this.get('risk');
        var cik  = this.get('cik');
        buffer.push('\
            <div class="donutHolder" id="donutHolder-'+cik+'">\
                <div class="donut" id="donut-'+cik+'"></div>\
                <span class="donutData" id="donutData-'+cik+'"></span>\
                <span class="donutData2" id="donutData2-'+cik+'"></span>\
            </div>\
        ')
    },
    didInsertElement: function() {
        var risk = this.get('risk');
        var cik  = this.get('cik');
        var data = this.makeDonutData(risk);
        $.plot($("#donut-" + cik), data, {
            series: {
                pie: {
                    innerRadius: .8,
                    show: true,
                    label: { show: false },
                    stroke: {
                        width: 0.1
                    }
                }
            },
            legend: { show: false }
        });
        
        $("#donutData-" + cik).html(risk.risk_quant);
        $("#donutData2-" + cik).html("Risk Score");
    },
    
    // Can send this to backend if we want to hide RISK THRESHOLDING
    makeDonutData: function (risk){

        amt_grey = 100 - risk.risk_quant + .001;

        amt_red    = Math.max(risk.risk_quant - HIGH_RISK_THRESH, 0);
        amt_yellow = Math.min(Math.max(risk.risk_quant - LOW_RISK_THRESH, 0), HIGH_RISK_THRESH - LOW_RISK_THRESH);
        amt_green  = Math.min(risk.risk_quant, LOW_RISK_THRESH);

        var ths = [
            { data: amt_grey, color: 'white' },
            { data: amt_red, color: 'red' },
            { data: amt_yellow, color: 'yellow' },
            { data: amt_green, color: '#33cc33' }
        ];
        return ths;
    }
});


App.QueryFiltsView = Ember.View.extend({
    didInsertElement: function(){
        this._super();
        this.$().hide().show('fast')
    }
});

App.DetailView = Ember.View.extend({
    controllerChanged: function() {
        $('html, body').animate({ scrollTop: 0 }, 0);
    }.observes('controller.model'),
    didInsertElement: function(){
        $('html, body').animate({ scrollTop: 0 }, 0);
    }
});


App.SargeneratorController = Ember.Controller.extend({
    report : " ------------ "
});
App.SargeneratorView = Ember.View.extend({
    templateName: 'sargenerator'
});

App.NewsView = Ember.View.extend({
    classNames : ["news"],
    controllerChanged : function () {
        this.rerender();
    }.observes('value'),
    didInsertElement : function () {
        var h = $('#uniqueRecordsTable').css('height');
        this.$().css('height', h);
    },
    render: function(buffer) {
        buffer.push('<iframe id="cse-iframe" src=\'' + this.get('value') + '\' style="height:100%"}} frameborder="0"></iframe>');
    }
});

App.FocusInputComponent = Ember.TextField.extend({
    attributeBindings: ['style', 'type', 'value', 'size'],
    becomeFocused: function() {
        this.$().focus();
    }.on('didInsertElement')
});

App.QueryBuilderInputComponent = Ember.TextField.extend({
    attributeBindings: ['style', 'type', 'value', 'size']
});

App.BigInputComponent = Ember.TextField.extend({
    attributeBindings: ['style', 'type', 'value', 'size'],
    becomeFocused: function() {
        this.$().focus();
    }.on('didInsertElement')
});





// Client

function fetch_companies(args){
    Ember.$.ajax({
        type        : 'POST',
        contentType : 'application/json',
        dataType    : "json",
        url     : 'fetch_companies',
        data    : JSON.stringify({
                    "index"      : args.index,
                    "query_type" : args.query_type,
                    "query_args" : args.query_args,
                    "from"       : args.from,
                    "rf"         : args.rf
                  }),
        success : args.callback,
        error   : function (xhr, status, error) {
                    console.log('Error: ' + error.message);
                  }
    });
};

function fetch_topic(args) {
   Ember.$.ajax({
        type        : 'POST',
        contentType : 'application/json',
        dataType    : "json",
        url     : 'fetch_topic',
        data    : JSON.stringify({
            "index"      : args.index,
            "query_type" : args.query_type,
            "query_args" : args.query_args,
            "from"       : args.from,
            "rf"         : args.rf
        }),
        success : args.callback,
        error   : function (xhr, status, error) {
            console.log('Error: ' + error.message);
        }
    });
}

function generate_sar(args){
    var cik = args.source.company_data.cik[0];
    Ember.$.ajax({
        type        : 'POST',
        contentType : 'application/json',
        dataType    : "json",
        url     : 'sar_generator',
        data    : JSON.stringify({ "cik" : cik }),
        success : args.callback,
        error   : function (xhr, status, error) {
            console.log('Error: ' + error.message);
        }
    });
};

function get_detail(cik, rf_clean) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
        fetch_companies({
            index      : config.COMPANY_INDEX,
            query_type : "detailQuery",
            query_args : {"cik" : cik},
            rf         : rf_clean,
            callback   : function(data) {
                console.log('detailQuery data', data);
                var hit = data.hits.hits[0]
                var detail = App.DetailModel.create();
                detail.set('cik',    hit._id);
                detail.set('source', hit._source);
                detail.set('fields', hit.fields);
                resolve(detail);
            }
        });
    });
};

App.SearchResults = Ember.Object.extend({
    total_hits    : undefined,
    hits          : [],
    from          : 0,
    tss           : undefined,
    unknown_names : undefined,
    broke         : false,

    page          : function() {
		return this.get('from') / gconfig.SIZE + 1
	}.property('from'),
    canGoBack     : function() { 
		return this.get('from') > 0;
	}.property('from'),
    canGoForward  : function() { 
		return this.get('from') + gconfig.SIZE < this.get('total_hits'); 
	}.property('from', 'total_hits')
});

App.Search = Ember.Object.extend({});
App.Search.reopenClass({

    search_company : function(searchTerm, rf_clean) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            fetch_companies({
                query_type : "companyQuery",
                query_args : {"searchTerm" : searchTerm},
                index      : 'companies',
                rf         : rf_clean,
                from       : 0,
                callback   : function(data) {
                    s = App.Search.process_query_results(data, rf_clean, true);
                    resolve(s)
                 }
            });
        });
    },
    
    search_topic : function(searchTerm, rf_clean) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            fetch_topic({
                query_type : "topicQuery",
                query_args : {"searchTerm" : searchTerm},
                index      : 'crowdsar_posts',
                rf         : rf_clean,
                from       : 0,
                callback   : function(data) {
                    s = App.Search.process_query_results(data, rf_clean, true)
                    s.set('unknown_names', data.names);
                    s.set('total_hits', data.total_hits_topic);
                    s.set('tss', data.tss);
                    resolve(s)
                 }
            });
        });
    },
        
    search_filters : function(rf_clean, from, s) {
        var from  = from == undefined ? 0 : from;
        var s     = s == undefined ? App.SearchResults.create() : s;
        return new Ember.RSVP.Promise(function(resolve, reject) {
            fetch_companies({
                query_type : "rfFilterQuery",
                query_args : {},
                index      : 'companies',
                rf         : rf_clean,
                from       : from,
                callback   : function (data) {
                    s = App.Search.process_query_results(data, rf_clean, false);
                    s.set('from', from || 0);
                    resolve(s);
                }
            });
        });
    },
    
    process_query_results : function(data, rf_clean, can_break) {
        console.log('about to process', data)

        var s          = App.SearchResults.create();
        var arr        = [];
        var last_score = -1;
        var counter    =  0;
        _.map(data.hits.hits, function(x){
            // For text searches, we make a cut off based on how well things
            // match the search terms.  For filtering, we don't want to do
            // that.  This is controlled by can_break.
            var cond  = can_break ? last_score / x._score <= gconfig.RES_THRESH : true;
            if(cond) {
                counter++
                last_score = x._score;
                var ret = {
                    "cik"          : x._id,
                    "currentName"  : x.fields.currentName,
                    "companyTable" : make_company_table(x._source.company_data),
                    "redFlags"     : set_red_flags(rf_clean, x.fields),
                    "score"        : x._score
                }
                if(x.fields.currentName[0] != null) {
                    arr.push(ret);
                } else {
                    console.log('missing info for', x);
                }
            } else {
                s.set('broke', true);
            }
        });

        s.set('hits', arr);
        s.get('broke') ? s.set('total_hits', counter) : s.set('total_hits', data.hits.total);
        return(s)
    },
    
    search_omx : function(cik) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
           Ember.$.ajax({
                type        : 'POST',
                contentType : 'application/json',
                dataType    : "json",
                url     :  'search_omx',
                data    : JSON.stringify({"cik" : cik}),
                success : function(response) {
                    console.log('response', response);
                    resolve(response);
                },
                error   : function (xhr, status, error) {
                    console.log('Error: ' + error.message);
                }
            });
        });
    },
    fetch_omx : function(omx_id) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
           Ember.$.ajax({
                type        : 'POST',
                contentType : 'application/json',
                dataType    : "json",
                url     :  'fetch_omx',
                data    : JSON.stringify({"omx_id" : omx_id}),
                success : function(response) {
                    console.log('response', response);
                    resolve(response);
                },
                error   : function (xhr, status, error) {
                    console.log('Error: ' + error.message);
            }
            });
        });
    }
});
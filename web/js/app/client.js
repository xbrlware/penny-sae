// web/js/app/client.js

function fetch(args) {
  Ember.$.ajax({
    type       : 'POST',
    contentType: 'application/json',
    dataType   : "json",
    url        : args.endpoint,
    data: JSON.stringify({
      "index"     : args.index,
      "query_type": args.query_type,
      "query_args": args.query_args,
      "from"      : args.from,
      "rf"        : args.rf
    }),
    success: args.callback,
    error: function (xhr, status, error) {
      console.log('Error: ' + error.message);
    }
  });
};

function get_detail(cik, rf_clean) {
  return new Ember.RSVP.Promise(function(resolve, reject) {
    fetch({
      endpoint  : "fetch_companies",
      index     : config.COMPANY_INDEX,
      query_type: "detailQuery",
      query_args: {"cik" : cik},
      rf        : rf_clean,
      callback  : function(data) {
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

App.SearchResultsView = Ember.View.extend({
  didInsertElement: function() {
    this._super();
    Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
  },

  afterRenderEvent: function() {
    // cik is passed into the view via the template
    var tid = this.get('cik');
    // tableContent is a function
    var f   = this.get('controller').get('tableContent');
    // hits is an array
    var h   = this.get('controller').get('hits');

    Ember.$('#' + tid).DataTable({
      data     : f(tid, h),
      bFilter  : false,
      bInfo    : false,
      columns  : this.get('controller').get('tableColumns')
    });
  }

});

App.SearchResults = Ember.Object.extend({
  total_hits   : undefined,
  hits         : [],
  from         : 0,
  tss          : undefined,
  unknown_names: undefined,
  broke        : false,

  tableColumns: [
    {title:'Date', defaultContent: "", className: "dt-body-right"},
    {title:'Name', defaultContent: ""},
    {title:'SIC', defaultContent: ""},
    {title:'State', defaultContent: ""}
  ],

  tableContent: function(cik, hits) {
    var content = [];
    hits.find(function(n) {
      if (cik === n.cik){
        _.map(n.companyTable, function(m) {
            content.pushObject([m.date,m.name,m.sic,m.state]);
        });
      }
    });
    return content;
  }
});

App.Search = Ember.Object.extend({});

App.Search.reopenClass({
  search_company: function(searchTerm, rf_clean) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      fetch({
        endpoint  : "fetch_companies",
        query_type: "companyQuery",
        query_args: {"searchTerm" : searchTerm},
        index     : 'companies',
        rf        : rf_clean,
        from      : 0,
        callback  : function(data) {
          resolve(App.Search.process_query_results(data, rf_clean, true));
        }
      });
    });
  },

  search_filters: function(rf_clean, from, s) {
    var from  = from === undefined ? 0 : from;
    var s     = s === undefined ? App.SearchResults.create() : s;
      return new Ember.RSVP.Promise(function(resolve, reject) {
        fetch({
          endpoint  : "fetch_companies",
          query_type: "rfFilterQuery",
          query_args: {},
          index     : 'companies',
          rf        : rf_clean,
          from      : from,
          callback  : function (data) {
            s = App.Search.process_query_results(data, rf_clean, false);
            s.set('from', from || 0);
            resolve(s);
          }
        });
      });
  },

  process_query_results: function(data, rf_clean, can_break) {
    var s          = App.SearchResults.create();
    var arr        = [];
    var last_score = -1;
    var counter    =  0;
    _.map(data.hits.hits, function(x){
      // For text searches, we make a cut off based on how well things
      // match the search terms.  For filtering, we don't want to do
      // that.  This is controlled by can_break.
      var cond  = can_break ? last_score / x._score <= gconfig.RES_THRESH : true;
      if (cond) {
        counter++;
        last_score = x._score;
        var ret = {
          "cik"         : x._id,
          "currentName" : x.fields.currentName,
          "companyTable": make_company_table(x._source.company_data),
          "redFlags"    : set_red_flags(rf_clean, x.fields),
          "score"       : x._score
        }
        if (x.fields.currentName[0] !== null) {
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

  search_omx: function(cik) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax({
        type       : 'POST',
        contentType: 'application/json',
        dataType   : "json",
        url        :  'search_omx',
        data       : JSON.stringify({"cik" : cik}),
        success    : function(response) {
          resolve(response);
        },
        error: function (xhr, status, error) {
          console.log('Error: ' + error.message);
        }
      });
    });
  },

  fetch_omx: function(omx_id) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax({
        type       : 'POST',
        contentType: 'application/json',
        dataType   : "json",
        url        :  'fetch_omx',
        data       : JSON.stringify({"omx_id" : omx_id}),
        success    : function(response) {
          resolve(response);
        },
        error: function (xhr, status, error) {
            console.log('Error: ' + error.message);
        }
      });
    });
  }
});

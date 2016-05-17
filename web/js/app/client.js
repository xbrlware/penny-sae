// web/js/app/client.js

function fetch (args) {
  Ember.$.ajax({
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    url: args.endpoint,
    data: JSON.stringify({
      'index': args.index,
      'query_type': args.query_type,
      'query_args': args.query_args,
      'from': args.from,
      'rf': args.rf
    }),
    success: args.callback,
    error: function (xhr, status, error) {
      console.log('Error: ' + error.message)
    }
  })
}

function get_detail (cik, rf_clean) {
  return new Ember.RSVP.Promise(function (resolve, reject) {
    fetch({
      endpoint: 'fetch_companies',
      index: config.COMPANY_INDEX,
      query_type: 'detailQuery',
      query_args: {'cik': cik},
      rf: rf_clean,
      callback: function (data) {
        var hit = data.hits.hits[0]
        var detail = App.DetailModel.create()
        detail.set('cik', hit._id)
        detail.set('source', hit._source)
        detail.set('fields', hit.fields)
        resolve(detail)
      }
    })
  })
}

App.SearchResults = Ember.Object.extend({
  total_hits: undefined,
  hits: undefined,
  from: 0,
})

App.SearchResultsView = Ember.View.extend({
  columns: [
    {title: 'Min Date',  defaultContent: '', className: 'dt-body-right'},
    {title: 'Max Date',  defaultContent: '', className: 'dt-body-right'},
    {title: 'Name',      defaultContent: ''},
    {title: 'Ticker',    defaultContent: ''},
    {title: 'SIC',       defaultContent: ''},
  ],

  didInsertElement: function () {
    this._super()
    Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent)
  },

  afterRenderEvent: function () {
    var cik = this.get('cik'),
      columns = this.get('columns')

    App.Search.get_company_table(this.get('cik')).then(function (response) {
      console.log(response.table)
      Ember.$('#' + cik).DataTable({
        fnDrawCallback: function (oSettings) {
          if (oSettings._iDisplayLength > oSettings.fnRecordsDisplay()) {
            Ember.$(oSettings.nTableWrapper).find('.dataTables_paginate').hide()
          }
        },
        columns: columns,
        data: response['table'],
        bFilter: false,
        bInfo: false,
      })
    })
  }
})


App.Search = Ember.Object.extend({})
App.Search.reopenClass({
  // >>
  search_company: function (query, redflag_params) {
    console.log('searching company')
    return new Ember.RSVP.Promise(function (resolve, reject) {
      Ember.$.ajax({
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        url: 'search',
        data: JSON.stringify({ 'query': query, 'redflag_params': redflag_params.get_toggled_params()}),
        success: function (response) {
          resolve(App.SearchResults.create(response))
        },
        error: function (xhr, status, error) {
          console.log('Error: ' + error.message)
        }
      })
    })
  },

  get_company_table: function (cik) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      Ember.$.ajax({
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        url: 'company_table',
        data: JSON.stringify({ 'cik': cik }),
        success: function (response) {
          resolve(response)
        }
      })
    })
  },

  cik2name: function (cik) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      Ember.$.ajax({
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        url: 'cik2name',
        data: JSON.stringify({ 'cik': cik }),
        success: function (response) {
          console.log('response --', response)
          resolve(response)
        }
      })
    })
  }
  // <<
  
  //
  //  process_query_results: function(data, rf_clean, can_break) {
  //    var s          = App.SearchResults.create()
  //    var arr        = []
  //    var last_score = -1
  //    var counter    =  0
  //    _.map(data.hits.hits, function(x){
  //      // For text searches, we make a cut off based on how well things
  //      // match the search terms.  For filtering, we don't want to do
  //      // that.  This is controlled by can_break.
  //      var cond  = can_break ? last_score / x._score <= gconfig.RES_THRESH : true
  //      if (cond) {
  //        counter++
  //        last_score = x._score
  //        var ret = {
  //          "cik"         : x._id,
  //          "currentName" : x.fields.currentName,
  //          "companyTable": make_company_table(x._source.company_data),
  //          "redFlags"    : set_red_flags(rf_clean, x.fields),
  //          "score"       : x._score
  //        }
  //        if (x.fields.currentName[0] !== null) {
  //          arr.push(ret)
  //        } else {
  //          console.log('missing info for', x)
  //        }
  //      } else {
  //        s.set('broke', true)
  //      }
  //    })
  //
  //    s.set('hits', arr)
  //    s.get('broke') ? s.set('total_hits', counter) : s.set('total_hits', data.hits.total)
  //    return(s)
  //  },

//  search_omx: function(cik) {
//    return new Ember.RSVP.Promise(function(resolve, reject) {
//      Ember.$.ajax({
//        type       : 'POST',
//        contentType: 'application/json',
//        dataType   : "json",
//        url        :  'search_omx',
//        data       : JSON.stringify({"cik" : cik}),
//        success    : function(response) {
//          resolve(response)
//        },
//        error: function (xhr, status, error) {
//          console.log('Error: ' + error.message)
//        }
//      })
//    })
//  },
//
//  fetch_omx: function(omx_id) {
//    return new Ember.RSVP.Promise(function(resolve, reject) {
//      Ember.$.ajax({
//        type       : 'POST',
//        contentType: 'application/json',
//        dataType   : "json",
//        url        :  'fetch_omx',
//        data       : JSON.stringify({"omx_id" : omx_id}),
//        success    : function(response) {
//          resolve(response)
//        },
//        error: function (xhr, status, error) {
//            console.log('Error: ' + error.message)
//        }
//      })
//    })
//  }
})

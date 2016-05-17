<<<<<<< HEAD
function time_filter(a,b,c){return a>b&a<c};delinquency=function(a,b){var c=0;a=null!=a?a:[];for(i=0;i<a.length;i++)c+=1==a[i].is_late&a[i].form==b.form&time_filter(a[i].deadline,b.min_date,b.max_date);return c};function combine_scores(a){return a.delinquency}var scores={symbology:-1,delinquency:-1};null!=params.symbology&&(scores.symbology=symbology(_source.symbology,params.symbology));null!=params.delinquency&&(scores.delinquency=delinquency(_source.delinquency,params.delinquency));combine_scores(scores);symbology=function(a,b){var c=0;a=null!=a?a:[];for(i=0;i<a.length;i++)c+=a[i].field==b.field&time_filter(a[i].new_date,b.min_date,b.max_date);return c};
=======
/*

    Scoring functions for `ernest_agg` data
    
    It would be nice to be able to load dependencies here.
    
    I imagine you could cut down on execution time if these
    functions didn't have to be redefined for every object...

*/

// --
// Helpers
function time_filter (date, min_date, max_date) {
  return (date > min_date) & (date < max_date)
}

// --
// Scoring functions
score_functions = {
  symbology: function (data, params) {
    var n = 0
    data = data != null ? data : []

    for (i = 0; i < data.length; i++) {
      var field = data[i].field == params.field
      n += (field & time_filter(data[i].new_date, params.min_date, params.max_date))
    }
    return n
  },
  delinquency: function (data, params) {
    var n = 0
    data = data != null ? data : []

    for (i = 0; i < data.length; i++) {
      var is_late = data[i].is_late == true
      var form = data[i].form == params.form
      n += is_late & form & time_filter(data[i].deadline, params.min_date, params.max_date)
    }
    return n
  }
}

var scores = {
  'symbology': -1,
  'delinquency': -1
}

if (params.symbology != null) {
  scores['symbology'] = score_functions.symbology(_source.symbology, params.symbology)
}

if (params.delinquency != null) {
  scores['delinquency'] = score_functions.delinquency(_source.delinquency, params.delinquency)
}

scores['delinquency']
>>>>>>> 7924aadf1da78b77c9f4a9e240d6e75a35a62ff4

function time_filter (a, b, c) {return a > b & a < c};delinquency = function (a, b) {var c = 0
  a = null != a ? a : []; for (i = 0;i < a.length;i++)c += 1 == a[i].is_late & a[i].form == b.form & time_filter(a[i].deadline, b.min_date, b.max_date);return c};function combine_scores (a) {return a.delinquency}var scores = {symbology: -1,delinquency: -1}
null != params.symbology && (scores.symbology = symbology(_source.symbology, params.symbology));null != params.delinquency && (scores.delinquency = delinquency(_source.delinquency, params.delinquency));combine_scores(scores);symbology = function (a, b) {var c = 0
  a = null != a ? a : []; for (i = 0;i < a.length;i++)c += a[i].field == b.field & time_filter(a[i].new_date, b.min_date, b.max_date);return c}

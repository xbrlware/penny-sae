function suspensions (doc, source, params, key) {
  var dates = doc['suspensions.date'].value;
  dates = Array.isArray(dates) ? dates : [dates]
  
  var n = 0;
  var have = dates.length > 0;
  if (have) {
    for (i = 0; i < dates.length; i++) {
      n += time_filter(dates[i], new Date(params.min_date).getTime(), new Date(params.max_date).getTime());
    }
  }
  return {
    'value': n,
    'is_flag': n > params.threshold,
    'have': have
  };
}

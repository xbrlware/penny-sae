function suspensions (doc, params, key) {
  var dates = doc['suspensions.date'].value;
  var n = 0;
  var have = dates != null;
  if (have) {
    dates = Array.isArray(dates) ? dates : [dates];
    for (i = 0; i < dates.length; i++) {
      n += time_filter(dates[i], new Date(params.min_date).getTime(), new Date(params.max_date).getTime());
    }
  }
  return {
    'value': n,
    'is_flag': n >= params.threshold,
    'have': have
  };
}

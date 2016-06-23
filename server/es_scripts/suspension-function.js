function suspensions (data, params) {
  var n = 0;
  var have = data != null;
  if (have) {
    for (i = 0; i < data.length; i++) {
      n += time_filter(data[i].date, params.min_date, params.max_date);
    }
  }
  return {
    'value': n,
    'is_flag': n > params.threshold,
    'have': have
  };
}

function crowdsar (data, params) {
  var n = 0;
  var have = data != null;
  if (have) {
    for (i = 0; i < data.length; i++) {
      if (time_filter(data[i].date, params.min_date, params.max_date)) {
        n += data[i][params.field];
      }
    }
  }
  return {
    'value': n,
    'is_flag': n > 0,
    'have': have
  };
}

function crowdsar (data, params) {
  var n = 0;
  var c = 0;
  var have = data != null;
  if (have) {
    for (i = 0; i < data.length; i++) {
      if (time_filter(data[i].date, params.min_date, params.max_date)) {
        c += 1;
        n += data[i][params.field];
      }
    }
  }

  if (params.metric == 'mean') {
    n = n / c;
  }

  return {
    'value': Math.round(100 * n) / 100,
    'is_flag': n >= params.threshold,
    'have': have
  };
}

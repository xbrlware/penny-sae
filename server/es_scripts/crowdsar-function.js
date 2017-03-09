function crowdsar (doc, params, key) {
  var data = doc[key + '_stringified'].values;
  var have = data != null;
  var n = 0;
  var c = 0;

  if (have) {
    for (i = 0; i < data.length; i++) {
      var pdata = JSON.parse(data[i]);
      if (time_filter(pdata.date, params.min_date, params.max_date)) {
        c += 1;
        n += pdata[params.field];
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

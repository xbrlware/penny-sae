function crowdsar (doc, params, key) {
  var data = doc[key + '_stringified'].value;
  var have = data != null;
  var n = 0;
  var c = 0;
  
  if (have) {
    var pdata = JSON.parse(data);
    for (i = 0; i < pdata.length; i++) {
      if (time_filter(pdata[i].date, params.min_date, params.max_date)) {
        c += 1;
        n += pdata[i][params.field];
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
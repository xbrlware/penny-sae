function financials (doc, params, key) {
  var data = doc[key + '_stringified'].values;
  var have = data != null;
  var n = 0;

  if (have) {
    for (i = 0; i < data.length; i++) {
      var pdata = JSON.parse(data[i]);
      var tf = time_filter(pdata.date, params.min_date, params.max_date);
      var field = pdata.field == params.field;
      var low = pdata.value < params.value;
      n += field & tf & low;
    }
  }

  return {
    'value': n,
    'is_flag': n >= params.threshold,
    'have': have
  };
}

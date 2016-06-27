function financials (data, params) {
  var have = data != null;
  var n = 0;

  if (data != null) {
    for (i = 0; i < data.length; i++) {
      var field = data[i].field == params.field;
      var tf = time_filter(data[i].date, params.min_date, params.max_date);
      var low = data[i].value < params.value;
      n += field & tf & low;
    }
  }

  return {
    'value': n,
    'is_flag': n > params.threshold,
    'have': have
  };
}

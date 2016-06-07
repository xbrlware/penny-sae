function symbology (data, params) {
  var n = 0;
  var have = data != null;
  data = data != null ? data : [];
  for (i = 0; i < data.length; i++) {
    var field = data[i].field == params.field;
    n += (field & time_filter(data[i].new_date, params.min_date, params.max_date));
  }
  return {
    'value': n,
    'is_flag': n >= params.threshold,
    'have': have
  };
}

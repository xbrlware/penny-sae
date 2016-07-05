function delinquency (data, params) {
  var n = 0;
  var have = data != null;
  if (have) {
    for (i = 0; i < data.length; i++) {
      var is_late = data[i].is_late == true;
      var form = data[i].form == params.form;
      n += (is_late & form & time_filter(data[i].deadline, params.min_date, params.max_date));
    }
  }
  return {
    'value': n,
    'is_flag': n >= params.threshold,
    'have': have
  };
}

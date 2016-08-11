function financials (doc, params, key) {
  var data = doc[key + '_stringified'].value;
  var have = data != null;
  var n = 0;

  if (have) {
    var pdata = JSON.parse(data);
    for (i = 0; i < pdata.length; i++) {
      var tf = time_filter(pdata[i].date, params.min_date, params.max_date);
      var field = pdata[i].field == params.field;
      var low = pdata[i].value < params.value;
      n += field & tf & low;
    }
  }

  return {
    'value': n,
    'is_flag': n >= params.threshold,
    'have': have
  }; 
}
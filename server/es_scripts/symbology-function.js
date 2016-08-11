function symbology (doc, params, key) {
  var data = doc[key + '_stringified'].value;
  var have = data != null;
  var n = 0;
  
  if (have) {
    var pdata = JSON.parse(data);
    for (i = 0; i < pdata.length; i++) {
      var tf = time_filter(data[i].new_date, params.min_date, params.max_date);
      var field = pdata[i].field == params.field;
      n += field & tf;
    }
  }
  
  return {
    'value': n,
    'is_flag': n >= params.threshold,
    'have': have
  };
}
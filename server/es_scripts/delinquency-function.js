function delinquency (doc, params, key) {
  var data = doc[key + '_stringified'].value;
  var have = data != null;
  var n = 0;
  
  if (have) {
    var pdata = JSON.parse(data);
    for (i = 0; i < pdata.length; i++) {
      var tf = time_filter(pdata[i].deadline, params.min_date, params.max_date);
      var form = pdata[i].form == params.form;
      var is_late = pdata[i].is_late == true;
      n += is_late & form & tf;
    }
  }
  
  return {
    'value': n,
    'is_flag': n >= params.threshold,
    'have': have
  };
}
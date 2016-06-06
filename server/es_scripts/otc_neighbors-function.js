function otc_neighbors(data, params) {
  var prop = 0;
  var cond1 = false;
  var cond2 = false;
  
  if(data != null) {
    prop = 100 * data.otc_count / data.total_count;
    cond1 = data.total_count >= params.number_of_neighbors[0]
    cond2 = data.total_count <= params.number_of_neighbors[1]
  }
  
  return {
    "value" : prop,
    "is_flag" : cond1 & cond1 & (prop > params.threshold),
    "have" : true
  }
}

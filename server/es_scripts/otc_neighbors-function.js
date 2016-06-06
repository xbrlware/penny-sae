function otc_neighbors(data, params) {
  var prop = 0;
  var cond1 = false;
  var cond2 = false;
  
  if(data != null) {
    prop = Math.round(100 * data.otc_paths / data.total_paths);
    // cond1 = data.total_count >= params.number_of_neighbors[0]
    // cond2 = data.total_count <= params.number_of_neighbors[1]
  }
  
  return {
    "value" : prop,
    // "is_flag" : (cond1 & cond1 & (prop > params.threshold)) > 0,
    "is_flag" : prop > 0,
    "have" : true
  }
}
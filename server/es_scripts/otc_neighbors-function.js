function otc_neighbors (doc, source, params, key) {
  var otc_paths = doc[key + '.otc_paths'].value;
  var total_paths = doc[key + '.total_paths'].value;
  
  var have = otc_paths != null;
  var prop = 0;
  var cond1 = false;
  var cond2 = false;

  if (have) {
    prop = Math.round(100 * otc_paths / total_paths);
    cond1 = total_paths >= params.number_of_neighbors[0];
    cond2 = total_paths <= params.number_of_neighbors[1];
  }

  return {
    'value': prop,
    'is_flag': (cond1 & cond2 & (prop >= params.threshold)),
    'have': have
  };
}

function otc_neighbors (data, params) {
  var have = data != null;
  var prop = 0;
  var cond1 = false;
  var cond2 = false;

  if (data != null) {
    prop = Math.round(100 * data.otc_paths / data.total_paths);
    cond1 = data.total_paths >= params.number_of_neighbors[0];
    cond2 = data.total_paths <= params.number_of_neighbors[1];
  }

  return {
    'value': (cond1 & cond2) ? prop : -1,
    'is_flag': (cond1 & cond2 & (prop >= params.threshold)),
    'have': have
  };
}

function combine_scores (scores, params) {
  // ** Temporary **
  // ... Need to actually determine how to combine these things...
  var out = 0;
  for (s in scores) {
    if(!isNaN(scores[s]['value'])) {
      out += scores[s]['is_flag'] * (1 + 0.01 * scores[s]['value']); 
    }
  }
  return out;
}

// Register functions
var functions = {
  // 'symbology': symbology,
  // 'delinquency': delinquency,
  'otc_neighbors': otc_neighbors,
  // 'crowdsar': crowdsar,
  'suspensions': suspensions,
  'financials': financials
};

function run () {
  // Compute scores (if parameterized)
  var scores = {};
  for (k in params) {
    kscore = functions[k](doc, _source, params[k], k);
    if (kscore.have) {scores[k] = kscore;}
  }

  return score ? combine_scores(scores, params) : scores;
}

run();

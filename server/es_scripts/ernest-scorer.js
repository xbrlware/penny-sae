function combine_scores (scores, params) {
    // ** Temporary **
    // ... Need to actually determine how to combine these things...
    var out = 0;
    for(s in scores) {
        out += scores[s]['is_flag'];
    }
    return out;
}

// Register functions
var functions = {
    "symbology"     : symbology,
    "delinquency"   : delinquency,
    "otc_neighbors" : otc_neighbors
}

function run() {
    // Compute scores (if parameterized)
    var scores = {}
    for(k in params) {
        scores[k] = functions[k](_source[k], params[k]);
    }
    
    return score ? combine_scores(scores, params) : scores;
}

run();

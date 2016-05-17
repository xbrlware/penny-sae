function combine_scores (scores, params) {
    // ** Temporary **
    // Need to actually determine how to combine these things...
    // User defined?
    return scores['symbology'] + scores['delinquency'];
}

function format_fields(scores, params) {
    out = {}
    for(s in scores) {
        out[s] = {
            "value"   : scores[s],
            "is_flag" : scores[s] >= params[s].threshold,
            "have"    : true
        }
    }
    return out
}

// Register functions
var functions = {
    "symbology"   : symbology,
    "delinquency" : delinquency
}

function run() {
    // Compute scores (if parameterized)
    var scores = {}
    for(k in params) {
        scores[k] = functions[k](_source[k], params[k]);
    }

    return score ? combine_scores(scores, params) : format_fields(scores, params);
}

run()
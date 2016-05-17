function combine_scores (scores, params) {
    // ** Temporary **
    // Need to actually determine how to combine these things...
    // User defined?
    return scores['symbology'] + scores['delinquency'];
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

    score ? combine_scores(scores, params) : scores;    
}

run()
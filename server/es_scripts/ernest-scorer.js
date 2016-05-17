function combine_scores (scores, params) {
    // ** Temporary **
    // Need to actually determine how to combine these things...
    // User defined?
    return out['symbology'] + out['delinquency'];
}

var functions = {
    "symbology"   : symbology,
    "delinquency" : delinquency
}

var scores = {}
for(k in params) { scores[k] = functions[k](_source[k], params[k]); }

score ? combine_scores(scores, params) : scores;
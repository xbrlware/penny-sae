function combine_scores(scores) {
    return scores['delinquency'];
}

var scores = {
    "symbology"   : -1,
    "delinquency" : -1
}

if(params.symbology != null) {
    scores['symbology'] = symbology(_source.symbology, params.symbology);
}

if(params.delinquency != null) {
    scores['delinquency'] = delinquency(_source.delinquency, params.delinquency);
}

combine_scores(scores)


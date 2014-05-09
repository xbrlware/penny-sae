// Determine (ordered) unique values of SIC

var ths   = _source.company_data[type];
var delta = [ths[0]];

var dates = _source.company_data.date;
var delta_dates = [dates[0]];
var since = dates[0];

for(i = 1; i < ths.length; i++){
    if(ths[i] != delta[delta.length - 1]){
        delta.push(ths[i]);
        delta_dates.push(dates[i]);
    };
    if(dates[i] < since){
        since = dates[i];
    }
}

var out = new Object;
out.values  = delta;
out.n       = delta.length;
out.dates   = delta_dates;
out.since   = since;
out;
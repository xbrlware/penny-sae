var pv = _source.pv;

var res = false;
for(i=1; i < pv.date.length; i++){
    if((pv.close[i] / pv.close[i-1]) > rat){
        res = true;
    }
}

res;












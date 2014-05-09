var ths = doc['time'].values;
var out = 0;
for(i in ths){
	out += ths[i];
}
return out > 10;
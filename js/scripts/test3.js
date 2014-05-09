var ths = doc['price'].values;
var all_rat = [];
var val = false;
var ths_rat = 1;
for(i = 1; i < ths.length; i++){
	ths_rat = ths[i] / ths[i-1];
	all_rat.push(ths_rat);
	if(ths_rat >= thresh){
		val = true;
	}
}

if(val)
	all_rat;
else
	[];
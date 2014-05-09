var ths = doc['price'].values;
var rat = 2;
var val = false;
for(i = 1; i < ths.length; i++){
	rat = ths[i] / ths[i-1];
	if(rat >= thresh){
		val = true;
		break;
	}
}
val;
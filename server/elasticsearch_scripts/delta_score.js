// Returns boosted number of changes
// if number of changes exceeds threshold

var BOOST_CONSTANT = 1000;
var thresh = thresh == undefined ? -1 : thresh;

if(_source.company_data != null) {
	var ths = _source.company_data[type];
	if(ths != undefined){
 	   var delta = [ths[0]];
  	  for(i = 1; i < ths.length; i++){
  	      if(ths[i] != delta[delta.length - 1]){
 	           delta.push(ths[i]);
 	       }
 	   }
    
  	  nchange = delta.length - 1;
 	   if(nchange >= thresh){
 	       BOOST_CONSTANT + nchange;
 	   } else {
 	       1;
	    }
	} else {
  	  1;
	}

} else {
	1;
}

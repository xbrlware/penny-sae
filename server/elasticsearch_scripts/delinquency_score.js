var BOOST_CONSTANT = 1000;
nlate    = 0;

var thresh = thresh == undefined ? 0 : thresh;
var since  = since == undefined ? 99 : since;

if(_source.del_proc != undefined){
   	var del_proc = _source.del_proc;
 	var now  = new Date()
 	var then = new Date()
  	then.setFullYear(now.getFullYear() - since)
  	
    	if(del_proc.date_of_filing != undefined){
    		for(i=0; i < del_proc.date_of_filing.length; i++){
            	var d  = new String(del_proc.date_of_filing[i]);
           		var d  = d.split('-')            
          		var dt = new Date()
           		dt.setFullYear(d[0], parseInt(d[1], 10) - 1, d[2])
           		if(dt > then){
           			if(del_proc.standard_late[i] == true){
               			nlate = nlate + 1;
           			}
           		}
        	}
    	}

        if(nlate >= thresh) {
                BOOST_CONSTANT + nlate;
        } else {
                1;
        }

} else {
	1;
}
	

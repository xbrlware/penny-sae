var promos = _source.promotions;
var n_promos = 0;

if(promos != null) {
	if(promos != undefined){

		var now  = new Date()
		var then = new Date()
		then.setMonth(now.getMonth() - past_months)

		for(i=0; i < promos.length; i++){
			if(promos[i].date != undefined){
	    		var d  = new String(promos[i].date).split('-');
				var dt = new Date();
				dt.setFullYear(d[0], parseInt(d[1]) - 1, d[2])

				if(dt > then) {
					n_promos += 1
				}
			}
		}
	}

	n_promos;

} else {
	null;
}

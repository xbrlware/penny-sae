

if(_source.otc_ass != null) {
	if(_source.otc_ass != undefined) {
		var otc = _source.otc_ass;
		
		if(otc['sum'].length == undefined){
			x = [].concat(otc['sum']);
		} else {
			x = otc['sum']
		}
		
		otc_neibs_total = 0;
		for(i=0; i<x.length; i++){
			otc_neibs_total += (x[i] > 0);
		}

		if(type == "otc_neibs_total") {
			otc_neibs_total;
		} else if(type == "otc_neibs_pct") {
			Math.round(100 * otc_neibs_total / (x.length))  ;
		}
		
	} else {
		0;
	}
} else {
	0;
}




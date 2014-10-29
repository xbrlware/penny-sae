
// Find all days with appropriately sized jump
function findSpikes(price_jump) {
    var spikes = [];
    if(pv.date != undefined){
    for(i = 1; i < pv.date.length; i++){
        var rat = pv.close[i] / pv.close[i-1];
        if(rat >= price_jump){
            spikes.push(i);
        }
    }
    }
    return spikes;
}


function checkFilter(spikes, volume_window, volume_multiplier, fall_within, fall_to) {
    var spike_dates = [];

    // Toss any spikes that come before volume_window after start
    var temp_spikes = [];
    for(i=0; i < spikes.length; i++){
        if(spikes[i] > volume_window){
            temp_spikes.push(spikes[i]);
        }
    }
    spikes = temp_spikes;
    
    var out = new Object;
    out.spikes         = [];
    out.spike_to       = [];
    out.spike_from     = [];
    out.spike_size     = [];
    out.spike_vol      = [];
    out.spike_dates    = [];
    out.vol_threshs    = [];
    out.min_rat        = [];
    out.condition_met  = [];
    out.fell_to        = [];
    out.fell_on        = [];

    if(spikes.length > 0){
    
        // Check if spike day meets other criteria
        for(s in spikes){
            
            var vol_thresh = -999;
            for(i=(spikes[s] - volume_window); i < spikes[s]; i++){
                if(pv.vol[i] > vol_thresh)
                    vol_thresh = pv.vol[i]
            }
            
            var cf = checkFall(spikes[s], fall_within, fall_to);
            if(pv.vol[spikes[s]] > vol_thresh & cf.condition_met){
                out.spikes.push(spikes[s]);
                
                out.spike_to.push(pv.close[spikes[s]]);
                out.spike_from.push(pv.close[spikes[s] - 1]);
                out.spike_size.push(Math.round(pv.close[spikes[s]] / pv.close[spikes[s] - 1] * 1000) / 1000);
                
                out.spike_dates.push(pv.date[spikes[s]]);
                
                out.vol_threshs.push(vol_thresh);
                out.spike_vol.push(pv.vol[spikes[s]]);
            
                out.min_rat.push(cf.min_rat);
                out.condition_met.push(cf.condition_met);
                out.fell_to.push(cf.fell_to);
                out.fell_on.push(cf.fell_on);
            }
        }
    }
   return out;
}

function checkFall(spk, fall_within, fall_to){
    
    var min = Infinity;
    var fell_on = [];
    for(i = 1; i <= fall_within; i++){
        if (pv.close[spk + i] < min){
            min = pv.close[spk + i];
            min_date = pv.date[spk + i];
        }
    }
    
    var out = new Object;
    if(min < Infinity){
        var min_rat = min / pv.close[spk];
        out.condition_met = min_rat <= fall_to;

        out.fell_to  = min;
        out.min_rat  = min_rat;
        out.fell_on  = min_date;
    } else {
        out.condition_met = true;

        out.fell_to  = [];
        out.min_rat  = [];
        out.fell_on  = [];
    }
    return out;
}

var pv = _source.pv;

if(pv != null){
	var volume_window      = volume_window == undefined ? 0 : volume_window;
	var price_jump         = price_jump == undefined ? 0 : price_jump;
	var volume_multiplier  = volume_multiplier == undefined ? 0 : volume_multiplier;
	var fall_within        = fall_within == undefined ? undefined : fall_within;
	var fall_to            = fall_to == undefined ? undefined : fall_to;

	var original_spikes = findSpikes(price_jump);
	if(original_spikes.length > 0){
		tmp = checkFilter(original_spikes, volume_window, 
    						volume_multiplier, fall_within, fall_to);
    	tmp;
	} else {
		[];
	}
} else {
	null;
}






























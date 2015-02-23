var pv = _source.pv;

var volume_window      = volume_window == undefined ? 0 : volume_window;            // Volume Lookback
var price_jump         = price_jump == undefined ? 0 : price_jump;                  // One Day Price Increase
var volume_multiplier  = volume_multiplier == undefined ? 0 : volume_multiplier;    // Amt Volume Multiplies anything in window
var fall_within        = fall_within == undefined ? undefined : fall_within;        // Falls to <fall_to> within this many days
var fall_to            = fall_to == undefined ? undefined : fall_to;                // Falls to this within <fall_within> days

// Find all days with appropriately sized jump
function findSpikes(price_jump) {
    var spikes = [];
    for(i = 1; i < pv.date.length; i++){
        var rat = pv.close[i] / pv.close[i-1];
        if(rat >= price_jump){
            spikes.push(i);
        }
    }
    return spikes;
}

function checkFilter_short(spikes, volume_window, volume_multiplier, fall_within, fall_to) {
    var spike_dates = [];

    // Toss any spikes that come before volume_window after start
    var temp_spikes = [];
    for(i=0; i < spikes.length; i++){
        if(spikes[i] > volume_window){
            temp_spikes.push(spikes[i]);
        }
    }
    spikes = temp_spikes;
    if(spikes.length == 0) {
        return false;
    } else {
        if(spikes.length > 0){
            // Check if spike day meets other criteria
        
            for(s in spikes){
                
                var vol_thresh = -999;
                for(i=(spikes[s] - volume_window); i < spikes[s]; i++){
                    if(pv.vol[i] > vol_thresh)
                        vol_thresh = pv.vol[i]
                }
                
                if(pv.vol[spikes[s]] > vol_thresh & checkFall_short(spikes[s], fall_within, fall_to)){
                    return true;
                }
            }
        }
       return false;
    }
}


function checkFall_short(spk, fall_within, fall_to){
    
    var min = Infinity;
    for(i = 1; i <= fall_within; i++){
        if (pv.close[spk + i] < min){
            min = pv.close[spk + i];
        }
    }
    
    if(min < Infinity){
        var val = min / pv.close[spk] <= fall_to;
        return val;
    } else {
        return true;
    }
}




var original_spikes = findSpikes(price_jump);
if(original_spikes.length > 0){
    checkFilter_short(original_spikes, volume_window, volume_multiplier, fall_within, fall_to);
} else {
    false;
}


























var BOOST_CONSTANT = 1000

// Find all days with appropriately sized jump
function findSpikes (price_jump, pv) {
  var spikes = []
  if (pv.date != undefined) {
    for (i = 1; i < pv.date.length; i++) {
      var rat = pv.close[i] / pv.close[i - 1]
      if (rat >= price_jump) {
        spikes.push(i)
      }
    }
  }
  return spikes
}

function checkFilter (spikes, volume_window, volume_multiplier, fall_within, fall_to) {
  var res = 0

  // Toss any spikes that come before volume_window after start
  var temp_spikes = []
  for (i = 0; i < spikes.length; i++) {
    if (spikes[i] > volume_window) {
      temp_spikes.push(spikes[i])
    }
  }
  spikes = temp_spikes

  if (spikes.length > 0) {
    // Check if spike day meets other criteria
    for (s in spikes) {
      var vol_thresh = -999
      for (i = (spikes[s] - volume_window); i < spikes[s]; i++) {
        if (pv.vol[i] > vol_thresh)
          vol_thresh = pv.vol[i]
      }

      var condition_met = checkFall(spikes[s], fall_within, fall_to)
      if (pv.vol[spikes[s]] > vol_thresh & condition_met) {
        res = res + 1
      }
    }
  }
  return res
}

function checkFall (spk, fall_within, fall_to) {
  var min = Infinity
  for (i = 1; i <= fall_within; i++) {
    if (pv.close[spk + i] < min) {
      min = pv.close[spk + i]
    }
  }

  if (min < Infinity) {
    var min_rat = min / pv.close[spk]
    condition_met = min_rat <= fall_to
  } else {
    condition_met = true
  }
  return condition_met
}

var pv = _source.pv

var volume_window = volume_window == undefined ? 0 : volume_window
var price_jump = price_jump == undefined ? 0 : price_jump
var volume_multiplier = volume_multiplier == undefined ? 0 : volume_multiplier
var fall_within = fall_within == undefined ? undefined : fall_within
var fall_to = fall_to == undefined ? undefined : fall_to
var thresh = thresh == undefined ? -1 : thresh

var original_spikes = findSpikes(price_jump, pv)
if (original_spikes.length > 0) {
  var l = checkFilter(original_spikes, volume_window,
    volume_multiplier, fall_within, fall_to)
  if (l >= thresh) {
    BOOST_CONSTANT + l
  } else {
    1
  }
} else {
  1
}

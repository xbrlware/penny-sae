// // web/js/app/data-management.js
//
// // Data manipulation
// /* global _, gconfig */
//
// function makeCompanyTable (d) { // eslint-disable-line no-unused-vars
//  var tab = []
//  if (d.cik !== undefined) {
//    for (var i = 0; i < d.cik.length; i++) {
//      tab.push({
//        'date': d.date === undefined ? undefined : d.date[i],
//        'name': d.company_name === undefined ? undefined : d.company_name[i],
//        'sic': d.sic === undefined ? undefined : d.sic[i],
//        'state': d.state_of_incorporation === undefined ? undefined : d.state_of_incorporation[i]
//      })
//    }
//  }
//  return (tab)
// }
//
// // Remember to update on server side as well
// function setRedFlags (rfClean, f) { // eslint-disable-line no-unused-vars
//  var out = { }
//
//  out.symbology_redflag = false
//  out.financials_redflag = false
//  out.trading_halts_redflag = false
//  out.delinquency_redflag = false
//  out.network_redflag = false
//
//  out.symbology_value = false
//  out.financials_value = false
//  out.trading_halts_value = false
//  out.delinquency_value = false
//  out.network_value = false
//
//  if (f.symbology !== undefined) {
//    out.have_symbology = true
//    out.symbology_value = f.symbology[0].nchange
//    out.symbology_redflag = f.symbology[0].nchange >= rfClean.symbology.thresh
//  }
//  if (f.financials_scriptfield !== undefined) {
//    out.have_financials = true
//    out.financials_value = f.financials_scriptfield[0]
//    out.financials_redflag = f.financials_scriptfield[0] > 0
//  }
//  if (f.trading_halts !== undefined) {
//    out.have_trading_halts = true
//    out.trading_halts_value = f.trading_halts[0]
//    out.trading_halts_redflag = f.trading_halts[0] > 0
//  }
//  if (f.delinquency_scriptfield !== undefined) {
//    out.have_delinquency = true
//    out.delinquency_value = f.delinquency_scriptfield[0]
//    out.delinquency_redflag = f.delinquency_scriptfield[0] >= rfClean.delinquency.thresh
//  }
//  if (f.network_scriptfield !== undefined) {
//    out.have_network = true
//    out.network_value = f.network_scriptfield[0]
//    out.network_redflag = f.network_scriptfield[0] > rfClean.network.thresh
//  }
//  if (f.crowdsar_scriptfield !== undefined) {
//    out.have_crowdsar = true
//    out.crowdsar_value = f.crowdsar_scriptfield[0]
//    out.crowdsar_redflag = f.crowdsar_scriptfield[0] > 0
//  }
//  if (f.pv_scriptfield !== undefined) {
//    out.have_pv = true
//    if (Object.keys(f.pv_scriptfield[0]).length > 0) {
//      out.pv_value = f.pv_scriptfield[0].condition_met.length
//      out.pv_redflag = f.pv_scriptfield[0].condition_met.length > 0
//    }
//  }
//
//  out.total = out.symbology_redflag + out.financials_redflag + out.trading_halts_redflag +
//  out.delinquency_redflag + out.network_redflag
//  out.possible = rfClean.toggles.symbology + rfClean.toggles.financials + rfClean.toggles.trading_halts +
//  rfClean.toggles.delinquency + rfClean.toggles.network
//  return out
// }
//
// function rfCleanFunc (rf, toggles) { // eslint-disable-line no-unused-vars
//  if (rf === undefined) return undefined
//
//  // If toggles is undefined, turn them all on
//  var cleanToggles = {}
//  if (toggles === undefined) {
//    _.map(gconfig.ALL_FEATURES, function (feature) {
//      cleanToggles[feature] = true
//    })
//  } else {
//    _.map(gconfig.ALL_FEATURES, function (feature) {
//      cleanToggles[feature] = toggles.get(feature)
//    })
//  }
//
//  var exists = {}
//  Object.keys(rf).map(function (key) {
//    if (key !== 'exists' && key !== 'toggles') {
//      exists[key] = false
//      if (rf[key] !== undefined) {
//        Object.keys(rf[key]).map(function (innerKey) {
//          if (rf[key][innerKey] !== undefined) {
//            exists[key] = true
//          }
//        })
//      }
//    }
//  })
//
//  rf.exists = exists
//  rf.toggles = cleanToggles
//  return rf
// }

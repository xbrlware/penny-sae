// web/js/app/data-management.js

// Data manipulation

function make_company_table(d){
    tab = [];
    if(d.cik != undefined) {
        for(i=0; i < d.cik.length; i++){
            tab.push({
                "date"  : d.date === undefined ? undefined : d.date[i],
                "name"  : d.company_name === undefined ? undefined : d.company_name[i],
                "sic"   : d.sic === undefined ? undefined : d.sic[i],
                "state" : d.state_of_incorporation === undefined ? undefined : d.state_of_incorporation[i]
            });
        }
    }
    return(tab)
};

// Remember to update on server side as well
function set_red_flags(rf_clean, f) {
    var out = new Object;

    out.delta_redflag         = false;
    out.financials_redflag    = false;
    out.trading_halts_redflag = false;
    out.delinquency_redflag   = false;
    out.network_redflag       = false;

    out.delta_value         = false;
    out.financials_value    = false;
    out.trading_halts_value = false;
    out.delinquency_value   = false;
    out.network_value       = false;

    if(f.delta != undefined) {
        out.have_delta = true;
        out.delta_value   = f.delta[0].nchange;
        out.delta_redflag = f.delta[0].nchange >= rf_clean.delta.thresh;
    }
    if(f.financials_scriptfield != undefined) {
        out.have_financials    = true;
        out.financials_value   = f.financials_scriptfield[0];
        out.financials_redflag = f.financials_scriptfield[0] > 0;
    }
    if(f.trading_halts != undefined) {
        out.have_trading_halts = true;
        out.trading_halts_value   = f.trading_halts[0];
        out.trading_halts_redflag = f.trading_halts[0] > 0;
    }
    if(f.delinquency_scriptfield != undefined) {
        out.have_delinquency    = true;
        out.delinquency_value   = f.delinquency_scriptfield[0];
        out.delinquency_redflag = f.delinquency_scriptfield[0] >= rf_clean.delinquency.thresh;
    }
    if(f.network_scriptfield != undefined) {
        out.have_network    = true;
        out.network_value   = f.network_scriptfield[0];
        out.network_redflag = f.network_scriptfield[0] > rf_clean.network.thresh;
    }
    if(f.crowdsar_scriptfield != undefined){
        out.have_crowdsar     = true;
        out.crowdsar_value    = f.crowdsar_scriptfield[0];
        out.crowdsar_redflag  = f.crowdsar_scriptfield[0] > 0;
    }
    if(f.pv_scriptfield != undefined) {
        out.have_pv   = true;
        if(Object.keys(f.pv_scriptfield[0]).length > 0){
            out.pv_value   = f.pv_scriptfield[0].condition_met.length;
            out.pv_redflag = f.pv_scriptfield[0].condition_met.length > 0;
        }
    }

    out.total    = out.delta_redflag + out.financials_redflag + out.trading_halts_redflag +
        out.delinquency_redflag + out.network_redflag;
    out.possible = rf_clean.toggles.delta + rf_clean.toggles.financials + rf_clean.toggles.trading_halts +
        rf_clean.toggles.delinquency + rf_clean.toggles.network;
    return out;
};

function rf_clean_func(rf, toggles) {
    if(rf === undefined) return undefined;

    // If toggles is undefined, turn them all on
    var clean_toggles = {}
    if(toggles === undefined) {
        _.map(gconfig.ALL_FEATURES, function(feature) {
            clean_toggles[feature] = true;
        });
    } else {
        _.map(gconfig.ALL_FEATURES, function(feature) {
            clean_toggles[feature] = toggles.get(feature);
        });
    }

    exists = {};
    Object.keys(rf).map(function(key) {
        if(key != "exists" && key != "toggles"){
            exists[key] = false;
            if(rf[key] !== undefined){
                Object.keys(rf[key]).map(function(inner_key) {
                    if(rf[key][inner_key] !== undefined)
                    exists[key] = true;
                });
            }
        }
    });

    rf.exists  = exists;
    rf.toggles = clean_toggles;
    return rf;
};

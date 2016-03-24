// Global Config
//
// These are mostly stylistic and interface config options
// that should be independant of where the app is deployed
{
    "SIZE"       : 15,
    "RES_THRESH" : 2,
    
    "NETWORK_EDGE_COLOR" : "lightgrey",
    "NETWORK_EDGE_WIDTH" : 1,
    
    "STANDARD_NODE_SIZE" : 7,
    "DRAG_NODE_SIZE"     : 12,
    
    "DEFAULT_HIDE_TERMINAL" : false,
    "DEFAULT_HIDE_NER"      : true,
    
    "ALL_FEATURES" : ["pv", "delta", "network", "financials", "trading_halts", "crowdsar", "delinquency"],
    "DEFAULT_RF" : {
        "pv" : {
            "price_jump"        : 100,
            "volume_window"     : 50,
            "volume_multiplier" : 10,
            "fall_to"           : 50,
            "fall_within"       : 50
        },
        "delta"      : {
            "type"   : "company_name",
            "thresh" : 2
        },
        "network" : {
            "type"   : "otc_neibs_pct",
            "thresh" : 25
        },
        "financials" : {
            "type"         : "revenues",
            "below"        : 1000,
            "below_for"    : 2,
            "contemporary" : "undefined"
        },
        "trading_halts" : {
            "thresh" : 1
        },
        "crowdsar" : {
            "type"        : "n_susp",
            "past_months" : 4
        },
        "delinquency" : {
            "thresh" : 5,
            "since"  : 2
        }
    },
    
    "DEFAULT_TOGGLES" : {
        "financials"    : true,
        "delta"         : true,
        "trading_halts" : true,
        "delinquency"   : false,
        "network"       : false,

        "pv"            : false,
        "crowdsar"      : false
    }
}


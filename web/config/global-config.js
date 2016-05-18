var gconfig = {
 "SIZE": 15,
 "RES_THRESH": 2,
 "NETWORK_EDGE_COLOR": "lightgrey",
 "NETWORK_EDGE_WIDTH": 1,
 "STANDARD_NODE_SIZE": 7,
 "DRAG_NODE_SIZE": 12,
 "DEFAULT_HIDE_TERMINAL": false,
 "DEFAULT_HIDE_NER": true,
 "ALL_FEATURES": [
  "pv",
  "symbology",
  "network",
  "financials",
  "trading_halts",
  "crowdsar",
  "delinquency"
 ],
<<<<<<< HEAD
 "DEFAULT_RF": {
  "pv": {
   "price_jump": 100,
   "volume_window": 50,
   "volume_multiplier": 10,
   "fall_to": 50,
   "fall_within": 50
  },
  "delta": {
   "type": "company_name",
   "thresh": 2
  },
  "network": {
   "type": "otc_neibs_pct",
   "thresh": 25
  },
  "financials": {
   "type": "revenues",
   "below": 1000,
   "below_for": 2,
   "contemporary": null
  },
  "trading_halts": {
   "thresh": 1
  },
  "crowdsar": {
   "type": "n_susp",
   "past_months": 4
=======
 "DEFAULT_REDFLAG_PARAMS": {
  "symbology": {
   "field": "name",
   "min_date": "2000-01-01",
   "max_date": "2016-01-01",
   "threshold": 1
>>>>>>> bkj-new-backend
  },
  "delinquency": {
   "form": "10-K",
   "min_date": "2000-01-01",
   "max_date": "2016-01-01",
   "threshold": 1
  }
 },
 "DEFAULT_TOGGLES": {
  "financials": false,
  "symbology": true,
  "trading_halts": false,
  "delinquency": true,
  "network": false,
  "pv": false,
  "crowdsar": false
 }
}
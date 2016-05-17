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
 "DEFAULT_REDFLAG_PARAMS": {
  "symbology": {
   "field": "name",
   "min_date": "2000-01-01",
   "max_date": "2016-01-01",
   "threshold": 1
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
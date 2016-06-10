var gconfig = {
 "SIZE": 15,
 "RES_THRESH": 2,
 "NETWORK_EDGE_COLOR": "lightgrey",
 "NETWORK_EDGE_WIDTH": 1,
 "STANDARD_NODE_SIZE": 7,
 "DRAG_NODE_SIZE": 12,
 "DEFAULT_HIDE_TERMINAL": false,
 "DEFAULT_HIDE_NER": true,
 "DEFAULT_REDFLAG_PARAMS": {
  "symbology": {
   "field": "name",
   "min_date": "2000-01-01",
   "max_date": "2017-01-01",
   "threshold": 1
  },
  "otc_neighbors": {
   "number_of_neighbors": [
    2,
    10
   ],
   "threshold": 50
  },
  "financials": {
   "type": "revenues",
   "min_date": "2000-01-01",
   "max_date": "2017-01-01",
   "value": 1000,
   "threshold": 10
  },
  "suspensions": {
   "min_date": "2000-01-01",
   "max_date": "2017-01-01",
   "threshold": 1
  },
  "delinquency": {
   "form": "10-K",
   "min_date": "2000-01-01",
   "max_date": "2017-01-01",
   "threshold": 3
  },
  "crowdsar": {
   "min_date": "2000-01-01",
   "max_date": "2017-01-01",
   "metric": "sum",
   "field": "n_posts",
   "threshold": 10
  }
 },
 "DEFAULT_TOGGLES": {
  "symbology": false,
  "suspensions": true,
  "delinquency": false,
  "crowdsar": true,
  "otc_neighbors": false,
  "financials": false,
  "pv": false
 },
 "N_TOP_X": 40,
 "DEBOUNCE": 500,
 "COOC_URL": "id/user",
 "GET_COOC_URL": "coocurrence",
 "GET_AGGS_URL": "aggs",
 "GAUGE": {
  "COLOR_PATT": [
   "green",
   "rgb(218, 218, 45)",
   "red"
  ],
  "SIZE": {
   "HEIGHT": 80,
   "WIDTH": 80
  },
  "TRANS_DURA": 0,
  "TOOTIP_SHOW": false
 }
}
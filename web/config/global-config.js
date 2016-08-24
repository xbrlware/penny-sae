var gconfig = {
 "SIZE": 15,
 "RES_THRESH": 2,
 "NETWORK_EDGE_COLOR": "lightgrey",
 "NETWORK_EDGE_WIDTH": 1,
 "STANDARD_NODE_SIZE": 7,
 "DRAG_NODE_SIZE": 12,
 "DEFAULT_HIDE_TERMINAL": false,
 "DEFAULT_HIDE_NER": true,
 "DEFAULT_DATE_FILTER": [
  "2010-01-01",
  "2017-01-01"
 ],
 "DEFAULT_REDFLAG_PARAMS": {
  "crowdsar": {
   "min_date": "2000-01-01",
   "max_date": "2017-01-01",
   "metric": "sum",
   "field": "n_posts",
   "threshold": 10
  },
  "delinquency": {
   "min_date": "2000-01-01",
   "max_date": "2017-01-01",
   "form": "10-K",
   "threshold": 3
  },
  "financials": {
   "min_date": "2000-01-01",
   "max_date": "2017-01-01",
   "field": "profit",
   "value": 1000,
   "threshold": 1
  },
  "otc_neighbors": {
   "number_of_neighbors": [
    2,
    10
   ],
   "threshold": 50
  },
  "suspensions": {
   "min_date": "2000-01-01",
   "max_date": "2017-01-01",
   "threshold": 1
  },
  "symbology": {
   "min_date": "2000-01-01",
   "max_date": "2017-01-01",
   "field": "name",
   "threshold": 1
  }
 },
 "DEFAULT_TOGGLES": {
  "symbology": false,
  "suspensions": true,
  "delinquency": false,
  "crowdsar": false,
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
   "rgba(0, 200, 0, 1.0)",
   "rgba(218, 218, 45, 1.0)",
   "rgba(200, 0, 0, 1.0)"
  ],
  "SIZE": {
   "HEIGHT": 80,
   "WIDTH": 80
  },
  "TRANS_DURA": 0,
  "TOOTIP_SHOW": false
 }
}
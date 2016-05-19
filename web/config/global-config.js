var gconfig = { // eslint-disable-line no-unused-vars
  'SIZE': 15,
  'RES_THRESH': 2,
  'NETWORK_EDGE_COLOR': 'lightgrey',
  'NETWORK_EDGE_WIDTH': 1,
  'STANDARD_NODE_SIZE': 7,
  'DRAG_NODE_SIZE': 12,
  'DEFAULT_HIDE_TERMINAL': false,
  'DEFAULT_HIDE_NER': true,
  'ALL_FEATURES': [
    'pv',
    'symbology',
    'network',
    'financials',
    'trading_halts',
    'crowdsar',
    'delinquency'
  ],
  'DEFAULT_REDFLAG_PARAMS': {
    'symbology': {
      'field': 'name',
      'min_date': '2000-01-01',
      'max_date': '2016-01-01',
      'threshold': 1
    },
    'network': {
      'type': 'otc_neibs_pct',
      'thresh': 25
    },
    'financials': {
      'type': 'revenues',
      'below': 1000,
      'min_date': '2000-01-01',
      'max_date': '2016-01-01',
      'contemporary': null
    },
    'trading_halts': {
      'thresh': 1
    },
    'delinquency': {
      'form': '10-K',
      'min_date': '2000-01-01',
      'max_date': '2016-01-01',
      'threshold': 1
    }
  },
  'DEFAULT_TOGGLES': {
    'financials': true,
    'symbology': true,
    'trading_halts': true,
    'delinquency': true,
    'network': true,
    'pv': false,
    'crowdsar': false
  }
};

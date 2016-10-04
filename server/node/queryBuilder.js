var _ = require('underscore')._;

module.exports = function (config) {
  function redflagScript (params, score) {
    return {
      'script': {
        'id': config.ES.SCRIPT,
        'lang': 'js',
        'params': {
          'score': score,
          'params': params
        }
      }
    };
  }

  return {
    'search': function (query, redFlagParams) {
      return {
        'query': { 'match_phrase': { 'searchterms': query } },
        'aggs': {
          'top_hits': {
            'top_hits': {
              'size': 50,
              '_source': ['cik', 'current_symbology.name'],
              'script_fields': {'redFlags': redflagScript(redFlagParams, false)}
            }
          }
        }
      };
    },
    'refresh': function (query, redFlagParams) {
      return {
        'query': { 'terms': { 'cik': query } },
        'aggs': {
          'top_hits': {
            'top_hits': {
              'size': 50,
              '_source': ['cik', 'current_symbology.name'],
              'script_fields': {'redFlags': redflagScript(redFlagParams, false)}
            }
          }
        }
      };
    },
    'topic': {
      'cik': function (query, size = 50, minDocCount = 1) {
        // Searching message boards
        return {
          'query': {
            'bool': {
              'must': {
                'match': {
                  'msg': query
                }
              },
              'should': {
                'match_phrase': {
                  'msg': query
                }
              }
            }
          },
          'aggs': {
            'ciks': {
              'terms': {
                'field': '__meta__.sym.cik',
                'minDocCount': minDocCount,
                'size': size
              }
            }
          }
        };
      },
      'sic_histogram': function (ciks, size = 25, minDocCount = 1) {
        return {
          'query': { 'terms': { 'cik': ciks } },
          'aggs': {
            'sics': {
              'terms': {
                'field': 'current_symbology.sic_lab.cat'
              }
            }
          }
        };
      },
      'companies': function (ciks, redFlagParams) {
        // Not implemented yet
        return false;
      }
    },
    'sort': function (redFlagParams) {
      return {
        'query': {
          'filtered': {
            'filter': {
              'or': _.map(_.keys(redFlagParams), function (key) {
                return { 'exists': {'field': key} };
              })
            },
            'query': {
              'function_score': {
                'functions': [ {'script_score': redflagScript(redFlagParams, true)} ]
              }
            }
          }
        },
        'aggs': {
          'top_hits': {
            'top_hits': {
              'size': 50,
              '_source': ['cik', 'current_symbology.name'],
              'script_fields': {'redFlags': redflagScript(redFlagParams, false)}
            }
          }
        }
      };
    },
    'company_table': function (cik) {
      return {
        '_source': ['min_date', 'name', 'ticker', 'sic', '__meta__'],
        'query': { 'term': { 'cik': cik } }, 'sort': [{'min_date': {'order': 'desc'}}]
      };
    },
    'cik2name': function (cik) {
      return {
        '_source': ['current_symbology.name', 'current_symbology.ticker'],
        'query': { 'term': { 'cik': cik } }
      };
    },
    'cik2tickers': function (cik) {
      return {
        'query': {'term': {'cik': cik}},
        'aggs': {'tickers': {'terms': {'field': 'ticker', 'size': 0}}}
      };
    },
    'suspensions': function (cik) {
      return {
        '_source': ['company', 'link', 'date', 'release_number'],
        'query': {
          'term': {
            '__meta__.sym.cik': cik
          }
        }
      };
    },
    'pv': function (ticker) {
      return {
        'query': {
          'constant_score': {
            'filter': {
              'term': {
                'symbol.cat': ticker.toLowerCase()
              }
            }
          }
        },
        'sort': {
          'date': {
            'order': 'asc'
          }
        }
      };
    },
    'delinquency': function (cik) {
      return {
        '_source': ['form', 'date', '_enrich', 'url'],
        'query': {
          'terms': {
            'cik': [cik, cik.replace(/^0*/, '')] // Searching both widths
          }
        },
        'sort': {
          'date': {
            'order': 'desc'
          }
        }
      };
    },
    'financials': function (cik) {
      return {
        '_source': ['name', 'form', 'date', 'url', '__meta__'],
        'query': {
          'filtered': {
            'filter': {
              'exists': {
                'field': '__meta__.financials'
              }
            },
            'query': {
              'terms': {
                'cik': [cik, cik.replace(/^0*/, '')] // Searching both widths
              }
            }
          }
        }
      };
    },
    'omx': function (omxObj) {
      var m1 = {'match': {'__meta__.sym.cik': omxObj.cik}};
      var m2 = omxObj.search ? {'term': {'article': omxObj.search}} : null;
      var r = {
        '_source': ['id', 'headline', 'date'],
        'sort': [
          {
            'date': {
              'order': 'desc'
            }
          }
        ],
        'query': {}
      };

      if (m2) {
        r.query['bool'] = {'must': [m1, m2]};
      } else {
        r.query = m1;
      }

      return r;
    }
  };
};

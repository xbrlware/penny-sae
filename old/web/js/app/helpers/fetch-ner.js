// web/js/app/helpers/fetch-ner.js
/* global Ember */

'use strict';

function fetchNer (args) { // eslint-disable-line no-unused-vars
  Ember.$.ajax({
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    url: 'fetchNer',
    data: JSON.stringify({'cik': args.cik, 'showHidden': args.showHidden}),
    success: args.callback,
    error: function (xhr, status, error) {
      console.error('ner.js :: ' + error.message);
    }
  });
}

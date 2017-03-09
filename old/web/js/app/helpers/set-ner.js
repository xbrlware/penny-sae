// web/js/app/helpers/set-ner.js
/* global Ember */

'use strict';

function setNer (args) { // eslint-disable-line no-unused-vars
  Ember.$.ajax({
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    url: 'setNer',
    data: JSON.stringify({'cik': args.cik, 'data': args.data}),
    success: args.callback,
    error: function (xhr, status, error) {
      console.error('ner.js :: ' + error.message);
    }
  });
}


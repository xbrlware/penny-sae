// web/js/app/helpers/fetch-tts.js
/* global Ember */

'use strict';

function fetchTts (args) { // eslint-disable-line no-unused-vars
  Ember.$.ajax({
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    url: 'fetchTts',
    data: JSON.stringify({
      'query_args': args.query_args
    }),
    success: args.callback,
    error: function (xhr, status, error) {
      console.error('tts-charts.js :: ' + error.message);
    }
  });
}

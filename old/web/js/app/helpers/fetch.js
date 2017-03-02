// web/js/app/helpers/fetch.js
/* global Ember */

'use strict';

function fetch (args) { // eslint-disable-line no-unused-vars
  Ember.$.ajax({
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    url: args.endpoint,
    data: JSON.stringify({
      'index': args.index,
      'query_type': args.query_type,
      'query_args': args.query_args,
      'from': args.from,
      'rf': args.rf
    }),
    success: args.callback,
    error: function (xhr, status, error) {
      console.log('Error: ' + error.message);
    }
  });
}

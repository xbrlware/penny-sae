// web/js/app/leadership.js

/* global Ember */

function fetchLeadership (args) { // eslint-disable-line no-unused-vars
  return new Ember.RSVP.Promise(function (resolve, reject) {
    Ember.$.ajax({
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      url: 'fetch_leadership',
      data: JSON.stringify({'cik': args.cik}),
      success: function (response) { resolve(response); },
      error: function (xhr, status, error) {
        console.error('leadership.js :: ' + error.message);
      }
    });
  });
}

// web/js/app/top-news.js
/* global Ember, App */

'use strict';

App.OmxNewsRoute = Ember.Route.extend({
  model: function (params) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      App.Search.fetch_data('omx_body', {'article_id': params.article_id}).then(function (response) {
        resolve(response.data);
      });
    });
  }
});

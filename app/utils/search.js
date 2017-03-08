// app/utils/search.js

import Ember from 'ember';
import SearchResults from './search-results';

export default Ember.Object.extend({
  searchCompany: function (query, redFlagParams, searchTopic, refresh) {
    searchTopic = searchTopic || false;
    refresh = refresh || false;
    return new Ember.RSVP.Promise(function (resolve) {
      Ember.$.ajax({
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        url: 'search',
        data: JSON.stringify({
          'query': query,
          'redFlagParams': redFlagParams.get_toggled_params(),
          'searchTopic': searchTopic,
          'mode': refresh ? 'refresh' : 'search'
        }),
        success: function (response) {
          resolve(SearchResults.create(response));
        },
        error: function (xhr, status, error) {
          console.error('XHR ::', xhr);
          console.error('STATUS ::', status);
          console.error('Error: ' + error.message);
        }
      });
    });
  },

  fetchData: function (detailName, name) {
    return new Ember.RSVP.Promise(function (resolve) {
      Ember.$.ajax({
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        url: detailName,
        data: typeof name === 'object' ? JSON.stringify(name) : name,
        success: function (response) {
          resolve(response);
        },
        error: function (error) {
          console.error('fetch_data :: ', error.message);
        }
      });
    });
  }
});

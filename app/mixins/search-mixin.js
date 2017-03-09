// app/mixins/search-mixin.js

import Ember from 'ember';

export default Ember.Mixin.create({
  searchCompany: function (query, redFlagParams, searchTopic, refresh) {
    searchTopic = searchTopic || false;
    refresh = refresh || false;
    return new Ember.RSVP.Promise(function (resolve) {
      Ember.$.ajax({
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        url: '/search',
        data: JSON.stringify({
          'query': query,
          'redFlagParams': redFlagParams.get_toggled_params(),
          'searchTopic': searchTopic,
          'mode': refresh ? 'refresh' : 'search'
        }),
        success: function (response) {
          response['from'] = 0;
          resolve(response);
        },
        error: function (xhr, status, error) {
          console.error('XHR ::', xhr);
          console.error('STATUS ::', status);
          console.error('Error: ' + error);
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
        url: '/' + detailName,
        data: typeof name === 'object' ? JSON.stringify(name) : name,
        success: function (response) {
          resolve(response);
        },
        error: function (error) {
          console.error('fetchData :: ', error);
        }
      });
    });
  }
});

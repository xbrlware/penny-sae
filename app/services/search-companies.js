// app/services/search-companies.js

import Ember from 'ember';
import RedFlagParams from '../objects/red-flag-params';

export default Ember.Service.extend({
  searchTerm: undefined,
  searchTopic: undefined,
  showNav: undefined,
  redFlagParams: undefined,
  isLoading: undefined, // state variable for spinner
  model: undefined,

  searchResult: Ember.Object.extend({
    total_hits: undefined,
    hits: undefined,
    from: 0
  }),

  init: function () {
    this.set('searchTopic', false);
    this.set('showNav', false);
    this.set('redFlagParams', RedFlagParams.create());
    this.set('isLoading', false);
  },

  getCompanies: function (searchTerm, update) {
    const _this = this;
    this.set('isLoading', true);
    this.set('showNav', true);
    this.set('searchTerm', searchTerm);
    return new Ember.RSVP.Promise(function (resolve) {
      _this.searchCompany(
        searchTerm,
        _this.get('redFlagParams'),
        _this.get('searchTopic'),
        update
      ).then(function (response) {
        _this.set('model', response);
        _this.set('isLoading', false);
        resolve(response);
      });
    });
  },

  getModel: function () {
    console.log('getModel :: ', this.get('model'));
    return this.get('model');
  },

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
          console.error('Error: ' + error.message);
        }
      });
    });
  }
});

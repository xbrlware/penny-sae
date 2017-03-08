// app/components/detail-component.js

import Ember from 'ember';
import SearchMixin from '../mixins/search-mixin';

export default Ember.Component.extend(SearchMixin, {
  searchCompanies: Ember.inject.service('search-companies'),
  redFlagParams: Ember.computed.alias('searchCompanies.redFlagParams'),
  companyDetails: undefined,

  init: function () {
    this._super(...arguments);
    this.fillDetails();
  },

  cikChanges: function () {
    this.fillDetails();
  }.observes('cik'),

  fillDetails: function () {
    const _this = this;
    console.log('cik in component::', this.get('cik'));
    this.get('fetchData')('cik2name', {cik: this.get('cik')}).then(function (response) {
      _this.set('companyDetails', response);
      console.log('companyDetails ::', _this.get('companyDetails'));
    });
  }
});

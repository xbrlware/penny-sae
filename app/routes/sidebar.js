import Ember from 'ember';
import _ from 'underscore';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  searchCompanies: Ember.inject.service('search-companies'),
  model: function (params) {
    if (params.st === '-') {
      this.get('searchCompanies').getCompanies(undefined, false);
    } else if (params.st === '--' && this.get('searchCompanies').getModel() !== null) {
      var ciks = _.pluck(this.get('searchCompanies').getModel().hits, 'cik');
      this.get('searchCompanies').getCompanies(ciks, true);
    } else {
      this.get('searchCompanies').getCompanies(params.st, false);
    }
  }
});

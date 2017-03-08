import Ember from 'ember';
import Gconfig from '../user-config/global-config';

export default Ember.Component.extend({
  searchCompanies: Ember.inject.service('search-companies'),
  redFlagParams: Ember.computed.alias('searchCompanies.redFlagParams'),
  searchTerm: Ember.computed.alias('searchCompanies.searchTerm'),
  searchTopic: Ember.computed.alias('searchCompanies.searchTopic'),
  isLoading: Ember.computed.alias('searchCompanies.isLoading'),
  model: Ember.computed.alias('searchCompanies.model'),

  willInsertElement: function () {
    Ember.$('body').css({
      'transition': 'background-color 0.5s ease-in-out',
      'background-color': 'white'
    });

    Ember.$('body').on('click.collapse-next.data-api', '[data-toggle=collapse-next]', function () {
      var $next = Ember.$(this).parent().next();
      var $others = Ember.$('.ab-sidebar');
      $others.collapse({toggle: false});
      $others.collapse('hide');
      $next.collapse('toggle');
    });
  },

  didInsertElement: function () {
    Ember.$('#big-dropdown-button').trigger('click.bs.dropdown');
  },

  renderTemplate: function () {
    this.render();
  },

  actions: {
    toggleFlag: function (flag) {
      let toggles = this.get('redFlagParams').get_toggles();
      if (toggles.get(flag)) {
        toggles.set(flag, false);
      } else {
        toggles.set(flag, true);
      }
    },

    sort_companies: function () {
      this.searchCompanies.getCompanies(undefined, false);
    },

    summary_detail: function () {
      return [1, 2, 3];
    },

    iterateSidebar: function (dir) {
      if (dir > 0) {
        this.set('from', this.get('from') + Gconfig.SIZE);
      } else {
        this.set('from', Math.max(this.get('from') - Gconfig.SIZE, 0));
      }

      this.set('isLoading', true);
      window.alert('look at the code -- this isnt actually implemented');
      this.searchCompanies.getCompanies(undefined, false);
    }
  }
});

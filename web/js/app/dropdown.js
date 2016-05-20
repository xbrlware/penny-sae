// web/js/app/dropdown.js

/* global Ember, App, _, gconfig*/

// Dropdown

App.DropdownController = Ember.ObjectController.extend({
  needs: ['application'],

  redFlagParams: Ember.computed.alias('controllers.application.redFlagParams'),

  symbology_select_content: [
    {id: undefined, name: 'Choose Type'},
    {id: 'company_name', name: 'Company Name'},
    {id: 'sic', name: 'SIC'},
    {id: 'state_of_incorporation', name: 'State of Incorporation'}
  ],
  crowdsar_select_content: [
    {id: undefined, name: 'Choose Metric'},
    {id: 'n_post', name: 'Number of Posts'},
    {id: 'n_susp', name: 'Number of Suspicious Posts'},
    {id: 'p_susp', name: 'Proportion of Suspicious Posts'}
  ],
  tout_select_content: [
    {id: undefined, name: 'Choose Metric'},
    {id: 'p_toutw', name: 'Proportion of Tout Words'},
    {id: 'n_toutw', name: 'Number of Tout Words'}
  ],
  network_select_content: [
    {id: undefined, name: 'Choose Type'},
    {id: 'otc_neibs_total', name: '% OTC Affiliated Neighbors'},
    {id: 'otc_neibs_pct', name: 'N OTC Affiliated Neighbors'}
  ],
  financials_select_content: [
    {id: undefined, name: 'Choose Type'},
    {id: 'revenues', name: 'Revenue'},
    {id: 'netincomeloss', name: 'Income'}
  ],
  financials_contemporary_select_content: [
    {id: undefined, name: 'Choose Type'},
    {id: 'false', name: 'Any Time'},
    {id: 'true', name: 'Ongoing'}
  ],
  late_filings_content: [
    {id: undefined, name: 'Choose Form'},
    {id: '10K', name: '10-k'}
  ],

  empty: true,
  pv: false,
  symbology: false,
  network: false,
  financials: false,
  crowdsar: false,
  trading_halts: false,
  delinquency: false,
  actions: {
    sort_companies: function () {
      var appCon = this.controllerFor('application');
      appCon.transitionToRoute('sidebar', '-');
    },

    showParameters: function (type) {
      this.set('empty', false);
      var self = this;
      _.map(gconfig.ALL_FEATURES, function (feature) {
        self.set(feature, false);
      });
      this.set(type, true);
    }
  }
});

App.DropdownView = Ember.View.extend({
  templateName: 'dropdown',
  didInsertElement: function () {
    Ember.$('#big-dropdown-button').trigger('click.bs.dropdown');

    Ember.$('.dropdown-menu tr').click(function (e) {
      e.preventDefault();
    });

    Ember.$('fa').click(function (e) {
      return false;
    });

    Ember.$('#compute-button').click(function (e) {
      return false;
    });

    Ember.$('#input-topic').click(function (e) {
      return false;
    });
  }
});

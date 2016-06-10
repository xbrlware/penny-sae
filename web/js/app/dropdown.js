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
    {id: 'n_posts', name: 'Number of Posts'},
  // Need to add more
  ],
  tout_select_content: [
    {id: undefined, name: 'Choose Metric'},
    {id: 'p_toutw', name: 'Proportion of Tout Words'},
    {id: 'n_toutw', name: 'Number of Tout Words'}
  ],
  otc_neighbors_select_content: [
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
    {id: '10-K', name: '10-K'}
  ],

  empty: true,
  pv: false,
  symbology: false,
  otc_neighbors: false,
  financials: false,
  crowdsar: false,
  suspensions: false,
  delinquency: false,
  actions: {
    sort_companies: function () {
      var appCon = this.controllerFor('application');
      appCon.transitionToRoute('sidebar', '');
      appCon.transitionToRoute('sidebar', '-');
    },

    showParameters: function (type) {
      this.set('empty', false);
      var self = this;
      _.map(_.keys(gconfig.DEFAULT_TOGGLES), function (feature) {
        try {
          self.set(feature, false);
        } catch(e) {
          console.log(e.message);
        }
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

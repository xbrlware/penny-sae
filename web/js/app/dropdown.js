// Dropdown

App.DropdownController = Ember.ObjectController.extend({
    needs       : ['application'],
    rf          : Ember.computed.alias('controllers.application.rf'),
    toggles     : Ember.computed.alias('controllers.application.toggles'),
        
    delta_select_content: [
        {id: undefined,                name: "Choose Type"},
        {id: "company_name",           name: "Company Name"},
        {id: "sic",                    name: "SIC"},
        {id: "state_of_incorporation", name: "State of Incorporation"}
    ],
    crowdsar_select_content: [
        {id: undefined,  name: "Choose Metric"},
        {id: "n_post",   name: "Number of Posts"},
        {id: "n_susp",   name: "Number of Suspicious Posts"},
        {id: "p_susp",   name: "Proportion of Suspicious Posts"}
    ],
    tout_select_content: [
        {id: undefined,  name: "Choose Metric"},
        {id: "p_toutw",  name: "Proportion of Tout Words"},
        {id: "n_toutw",  name: "Number of Tout Words"}
    ],
    network_select_content: [
        {id: undefined,              name: "Choose Type"},
        {id: "otc_neibs_total", name: "% OTC Affiliated Neighbors"},
        {id: "otc_neibs_pct",   name: "N OTC Affiliated Neighbors"}
    ],
    financials_select_content: [
        {id: undefined,          name: "Choose Type"},
        {id: "revenues",         name: "Revenue"},
        {id: "netincomeloss",    name: "Income"}
    ],
    financials_contemporary_select_content: [
        {id: undefined,  name: "Choose Type"},
        {id: "false",    name: "Any Time"},
        {id: "true",     name: "Ongoing"}
    ],
    
    empty        : true,
    pv           : false,
    delta        : false,
    network      : false,
    financials   : false,
    crowdsar     : false,
    trading_halts: false,
    delinquency  : false,
    actions : {
        showParameters : function (type) {
            this.set('empty', false);
            self = this;
            _.map(gconfig.ALL_FEATURES, function(feature) {
                self.set(feature, false);
            })
            this.set(type, true);
        }
    }
});

App.DropdownView = Ember.View.extend({
    templateName : "dropdown",
    didInsertElement : function () {
        $('#big-dropdown-button').trigger('click.bs.dropdown');
        $('.dropdown-menu tr').click(function(e) {
            e.preventDefault();
        });
        $('fa').click(function(e) {
            return false;
        });
        $('#compute-button').click(function(e) {
            return false;
        });
        $('#input-topic').click(function(e) {
            return false;
        });
        $('table.hoverTable tr').not('tr.no-hover').hover(
            function () {
                $(this).not('td.dropdown-button').css('background-color', 'whiteSmoke');
            },
            function () {
                $(this).css('background-color', 'white');
                $(this).find('td.dropdown-button').css('background-color', 'red');
            }
        );

        $('td.dropdown-button').hover(
            function () {
                $(this).css('background-color', "rgb(208, 43, 43)");
                $(this).css('color', 'whiteSmoke');
            },
            function () {
                $(this).css('background-color', 'red');
                $(this).css('color', 'whiteSmoke');
            }
        );
    }
});
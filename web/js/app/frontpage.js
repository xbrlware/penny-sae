// Front Page
App.FrontpageRoute = Ember.Route.extend({
    setupController : function(controller, model) {
        this.controllerFor('application').set('showNav', false);
    },
    actions : {
        companySearch: function() {
            var st = this.get('controller').get('searchTerm');
            if(st){
                this.controllerFor('application').set('showNav', true);
                this.transitionTo('sidebar', st);
            }
        },
        toggleFlag : function(flag) {
            this.get('controller').get('toggles').toggleProperty(flag);
        },
        goToSidebar : function() {
            this.controllerFor('application').set('showNav', true);
            this.transitionTo('sidebar', undefined);
            this.get('controller').set('isLoading', false);
        }
    }
});

App.FrontpageController = Ember.ObjectController.extend({
    needs            : ['application'],
    rf               : Ember.computed.alias('controllers.application.rf'),
    toggles          : Ember.computed.alias('controllers.application.toggles'),
    searchTerm       : Ember.computed.alias('controllers.application.searchTerm'),

    isLoading : false
});

App.FrontpageView = Ember.View.extend({
    didInsertElement : function() {
        $('body').css('background-color', 'whiteSmoke');
        $('table.hoverTable').find('tr').not('tr.no-hover').hover(
            function () {
                $(this).css('background-color', 'whiteSmoke');
            },
            function () {
                $(this).css('background-color', 'white');
            }
        );
    }
});

// --

App.ToggleRowView = Ember.View.extend({
    templateName : "togglerow",
    tagName : "tr",
    click : function(e) {
        if($(e.target).attr('class') != "dropdown-button") {
            var value = this.get('value');
            this.toggleProperty('value');
        }
    }
});

App.DisabledToggleRowView = Ember.View.extend({
    templateName : "disabledtogglerow",
    tagName      : "tr",
    classNames   : ["no-hover"]
});

App.HitTextView = Ember.View.extend({
    templateName : "hittextview",
    didInsertElement : function() {
        var type     = this.get('type');
        var redFlags = this.get('redFlags');
        
        this.set('mid', 'badge-' + type);
        this.set('have', redFlags['have_' + type]);
        this.set('flagged', redFlags[type + '_redflag']);
        this.set('value', redFlags[type + '_value']);
    }
});



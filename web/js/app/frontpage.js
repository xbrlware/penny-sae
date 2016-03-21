// web/js/app/frontpage.js

// Front Page
App.FrontpageRoute = Ember.Route.extend({
    setupController : function(controller, model) {
        this.controllerFor('application').set('showNav', false);
    },
    actions : {
        companySearch: function(searchTerm) {
            if(searchTerm){ this.transitionTo('sidebar', searchTerm); }
        },
        filterSearch : function() {
            this.transitionTo('sidebar', '-');
        },
        toggleFlag : function(flag) {
            this.get('controller').get('toggles').toggleProperty(flag);
        }
    }
});

App.FrontpageController = Ember.ObjectController.extend({
    needs   : ['application'],
    toggles : Ember.computed.alias('controllers.application.toggles'),
});

// --

App.ToggleRowView = Ember.View.extend({
    classNames: ["toggle-row-bg"],
    templateName : "togglerow",
    tagName : "tr",
    click : function(e) {
        if($(e.target).attr('class') !== "dropdown-button") {
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



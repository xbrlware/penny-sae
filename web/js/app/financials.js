// web/js/app/financials.js

// Financials

App.FinancialsRoute = Ember.Route.extend({
    model : function() {
        var financialsTable = this.modelFor('detail').get('financialsTable');

        console.log(' ************', financialsTable);
        return financialsTable;
    }
});

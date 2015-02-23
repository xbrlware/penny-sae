// Delinquency

App.DelinquencyRoute = Ember.Route.extend({
    model : function() {
        var delinquencyTable = this.modelFor('detail').get('delinquencyTable');
        console.log(' ************', delinquencyTable);
        return delinquencyTable;
    }
});
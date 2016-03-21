// web/js/app/previous-reg.js

// Previous Regulatory Actions

App.PreviousRegRoute = Ember.Route.extend({
    model : function() {
        var regs = this.modelFor('detail').get('tradingHalt');
        console.log(' ************ regulatory actions', regs);
        return regs;
    }
});

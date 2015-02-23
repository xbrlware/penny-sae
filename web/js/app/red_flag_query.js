// Red Flag Query
App.Toggles = Ember.Object.extend({
    financials    : gconfig.DEFAULT_TOGGLES.financials,
    delta         : gconfig.DEFAULT_TOGGLES.delta,
    trading_halts : gconfig.DEFAULT_TOGGLES.trading_halts,
    delinquency   : gconfig.DEFAULT_TOGGLES.delinquency,
    network       : gconfig.DEFAULT_TOGGLES.network,

    pv            : gconfig.DEFAULT_TOGGLES.pv,
    crowdsar      : gconfig.DEFAULT_TOGGLES.crowdsar
});

App.RFQ = Ember.Object.extend({
    searchTerm       : undefined,
    searchTerm_topic : undefined,
    showNav          : false,
    rf               : gconfig.DEFAULT_RF,
    toggles          : App.Toggles.create()
});

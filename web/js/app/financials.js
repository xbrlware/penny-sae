// web/js/app/financials.js

// Financials

App.FinancialsRoute = Ember.Route.extend({
    model : function() {
        var financialsTable = this.modelFor('detail').get('financialsTable');
        return financialsTable;
    }
});

App.FinancialsView = Ember.View.extend({
  didInsertElement: function() {
    this._super();
    Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
  },

  afterRenderEvent: function() {
    var self = this;
    var con = self.get('controller');
    Ember.$('#financials-table').DataTable({
      data: con.tableContent(),
      columns: con.tableColumns()
    });
  }
});
  
App.FinancialsController = Ember.Controller.extend({
    tableColumns: function() {
      return [
        {title:'Balance Sheet'},
        {title:'Filing'},
        {title:'Fiscal Year End'},
        {title:'Revenues'},
        {title:'Net Income'},
        {title:'Assets'}]
    },
        
    tableContent: function() {
      var m = this.get('model');
      var content = [];
      _.map(m, function(n) {
        content.pushObject([
          n.bsd,
          n.type,
          n.fy,
          n.revenues_pretty,
          n.netincome_pretty,
          n.assets_pretty
        ]);
      });
      return content;
    }
});

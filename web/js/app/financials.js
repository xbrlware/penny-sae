// web/js/app/financials.js

// Financials

App.FinancialsRoute = Ember.Route.extend({
    model : function() {
        var financialsTable = this.modelFor('detail').get('financialsTable');
        return financialsTable;
    }
});

App.FinancialsController = Ember.Controller.extend({
    tableColumns: Ember.computed(function() {
      var balanceSheet = Ember.Table.ColumnDefinition.create({
        textAlign: 'center',
        headerCellName: 'Balance Sheet',
        getCellContent: function(row) {
            return row.get('bsd');
        }
      });

      var filing = Ember.Table.ColumnDefinition.create({
        textAlign: 'center',
        headerCellName: 'Filing',
        getCellContent: function(row) {
          return row.get('type');
        }
      });

      var fiscalYearEnd = Ember.Table.ColumnDefinition.create({
        textAlign: 'center',
        headerCellName: 'Fiscal Year End',
        getCellContent: function(row) {
          return row.get('fy');
        }
      });

      var revenues = Ember.Table.ColumnDefinition.create({
        textAlign: 'center',
        headerCellName: 'Revenues',
        getCellContent: function(row) {
          return row.get('revenues_pretty');
        }
      });

      var netIncome = Ember.Table.ColumnDefinition.create({
        textAlign: 'center',
        headerCellName: 'Net Income',
        getCellContent: function(row) {
          return row.get('netincome_pretty');
        }
      });

      var assets = Ember.Table.ColumnDefinition.create({
        textAlign: 'center',
        headerCellName: 'Assets',
        getCellContent: function(row) {
          return row.get('assets_pretty');
        }
      });
 
      return [balanceSheet, filing, fiscalYearEnd, revenues, netIncome, assets];
    }),

    tableContent: Ember.computed(function() {
      var m = this.get('model');
      var content = [];
      _.map(m, function(n) {
        content.pushObject({
          'bsd': n.bsd,
          'type': n.type,
          'fy': n.fy,
          'revenues_pretty': n.revenues_pretty,
          'netincome_pretty': n.netincome_pretty,
          'assets_pretty': n.assets_pretty
        });
      });
      console.log('financial content --> ', content);
      return content;
    })
});

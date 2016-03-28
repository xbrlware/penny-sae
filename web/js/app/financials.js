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
        columnWidth: 100,
        headerCellName: 'Balance Sheet',
        getCellContent: function(row) {
            return row.bsd;
        }
      });

      var filing = Ember.Table.ColumnDefinition.create({
        textAlign: 'center',
        columnWidth: 100,
        headerCellName: 'Filing',
        getCellContent: function(row) {
          return row.type;
        }
      });

      var fiscalYearEnd = Ember.Table.ColumnDefinition.create({
        textAlign: 'center',
        columnWidth: 100,
        headerCellName: 'Fiscal Year End',
        getCellContent: function(row) {
          return row.fy;
        }
      });

      var revenues = Ember.Table.ColumnDefinition.create({
        textAlign: 'center',
        columnWidth: 100,
        headerCellName: 'Revenues',
        getCellContent: function(row) {
          return row.revenues_pretty;
        }
      });

      var netIncome = Ember.Table.ColumnDefinition.create({
        textAlign: 'center',
        columnWidth: 100,
        headerCellName: 'Net Income',
        getCellContent: function(row) {
          return row.netincome_pretty;
        }
      });

      var assets = Ember.Table.ColumnDefinition.create({
        textAlign: 'center',
        columnWidth: 100,
        headerCellName: 'Assets',
        getCellContent: function(row) {
          return row.assets_pretty;
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

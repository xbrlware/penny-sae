// web/js/app/delinquency.js

// Delinquency

App.DelinquencyRoute = Ember.Route.extend({
    model : function() {
        var delinquencyTable = this.modelFor('detail').get('delinquencyTable');
        return delinquencyTable;
    }
});

App.DelinquencyController = Ember.Controller.extend({
    tableColumns: Ember.computed(function() {
      var dateOfFiling = Ember.Table.ColumnDefinition.create({
        textAlign: 'center',
        headerCellName: 'Date of Filing',
        getCellContent: function(row) {
            return row.dof;
        }
      });

      var dueDate = Ember.Table.ColumnDefinition.create({
        textAlign: 'center',
        headerCellName: 'Due Date',
        getCellContent: function(row) {
          return row.dd;
        }
      });

      var form = Ember.Table.ColumnDefinition.create({
        textAlign: 'center',
        headerCellName: 'Form',
        getCellContent: function(row) {
          return row.form;
        }
      });

      var late = Ember.Table.ColumnDefinition.create({
        textAlign: 'center',
        headerCellName: 'Late',
        getCellContent: function(row) {
          if(row.std_late) {
            return 'Late Filing';
          } else {
            return 'On Time';
          }
        }
      });

      return [dateOfFiling, dueDate, form, late];
    }),

    tableContent: Ember.computed(function() {
      var content = [];
      _.map(this.get('model'), function(n) {
        content.pushObject({
          'dof': n.dof,
          'dd': n.dd,
          'form': n.form,
          'std_late': n.std_late,
        });
      });
      return content;
    })
});


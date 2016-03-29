// web/js/app/delinquency.js

// Delinquency

App.DelinquencyRoute = Ember.Route.extend({
    model : function() {
        var delinquencyTable = this.modelFor('detail').get('delinquencyTable');
        return delinquencyTable;
    }
});

App.DelinquencyController = Ember.Controller.extend(Ember.SortableMixin, {
  sortProperties: ['DateOfFiling'],
  sortAscending: true,

    tableColumns: Ember.computed(function() {
      var dateOfFiling = Ember.Table.ColumnDefinition.create({
        textAlign: 'center',
        can_sort: true,
        headerCellName: 'Date of Filing',
        getCellContent: function(row) {
            return row.get('dof');
        }
      });

      var dueDate = Ember.Table.ColumnDefinition.create({
        textAlign: 'center',
        can_sort: true,
        headerCellName: 'Due Date',
        getCellContent: function(row) {
          return row.get('dd');
        }
      });

      var form = Ember.Table.ColumnDefinition.create({
        textAlign: 'center',
        can_sort: true,
        headerCellName: 'Form',
        getCellContent: function(row) {
          return row.get('form');
        }
      });

      var late = Ember.Table.ColumnDefinition.create({
        textAlign: 'center',
        can_sort: true,
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
    }),

    actions: {
      sortBy: function(property) {
        if (property === this.get('sortProperties')[0]) {
          this.toggleProperty('sortAscending');
        } else {
          this.set('sortAscending', true);
        }
        this.set('sortProperties', [property]);
      }
    }
});


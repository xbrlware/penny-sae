// web/js/app/delinquency.js

// Delinquency

App.DelinquencyRoute = Ember.Route.extend({
    model : function() {
        var delinquencyTable = this.modelFor('detail').get('delinquencyTable');
        return delinquencyTable;
    }
});

App.DelinquencyView = Ember.View.extend({
  didInsertElement: function() {
    this._super();
    Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
  },

  afterRenderEvent: function() {
    var self = this;
    var con = self.get('controller');
    Ember.$('#delinquency-table').DataTable({
      data: con.tableContent(),
      columns: con.tableColumns()
    });
  }
});

App.DelinquencyController = Ember.Controller.extend(Ember.SortableMixin, {
    tableColumns: function() {
      return [
        {title: 'Date of Filing'},
        {title: 'Due Date'},
        {title: 'Form'},
        {title: 'Late Filing'}]
    },

    tableContent: function() {
      var content = [];
      _.map(this.get('model'), function(n) {
        content.pushObject([n.dof,n.dd,n.form, n.std_late]);
      });
      return content;
    },

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


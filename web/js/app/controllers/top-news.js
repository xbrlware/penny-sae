// web/js/app/controllers/top-news.js

/* global Ember, App */

App.TopNewsController = Ember.Controller.extend({
  needs: ['detail'],
  name: Ember.computed.alias('controllers.detail.model'),
  setModel: function (sw) {
    var _this = this;
    App.Search.fetch_data('omx', {cik: this.get('name').cik, search: sw}).then(
      function (response) {
        _this.set('model', response.data);
        if (response.data.length > 0) {
          _this.transitionTo('omxNews', response.data[0].id);
        } else {
          _this.transitionTo('topNews');
        }
      }
    );
  },

  actions: {
    newsSearch: function (searchWord) {
      this.setModel(searchWord);
    }
  }
});

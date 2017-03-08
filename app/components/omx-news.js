// app/components/omx-news.js

import Ember from 'ember';
import SearchMixin from '../mixins/search-mixin';

export default Ember.Component.extend(SearchMixin, {
  id: undefined,
  articleModel: undefined,
  init: function () {
    this._super(...arguments);
    const _this = this;
    this.set('id', this.get('articleId'));
    console.log('omx news ::', this.get('articleId'));
    return new Ember.RSVP.Promise(function () {
      _this.get('fetchData')('omx_body', {'article_id': _this.get('id')}).then(function (response) {
        this.set('articleModel', response.data);
      });
    });
  }
});

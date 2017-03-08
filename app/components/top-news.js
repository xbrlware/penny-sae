// app/components/top-news.js

import Ember from 'ember';
import SearchMixin from '../mixins/search-mixin';

export default Ember.Component.extend(SearchMixin, {
  newsModel: undefined,
  articleModel: undefined,
  articleId: undefined,
  searchWord: undefined,
  newsCik: undefined,

  init () {
    this._super(...arguments);
    this.set('newsCik', this.get('model'));
    this.searchArticles();
  },

  searchArticles () {
    const _this = this;
    let cik = this.get('newsCik');
    let sw = this.get('searchWord');
    this.get('fetchData')('omx', {cik: cik, search: sw}).then(
      function (response) {
        _this.set('newsModel', response.data);
        if (response.data.length > 0) {
          _this.set('articleId', response.data[0].id);
          _this.getArticle();
        } else {
          _this.set('articleId', undefined);
        }
      }
    );
  },

  getArticle () {
    const _this = this;
    this.get('fetchData')(
      'omx_body',
      {'article_id':
        this.get('articleId')
      }).then(function (response) {
        _this.set('articleModel', response.data);
      });
  },

  actions: {
    newsSearch: function (searchWord) {
      this.set('searchWord', searchWord);
      this.searchArticles();
    },

    findArticle (id) {
      this.set('articleId', id);
      this.getArticle();
    }
  }
});

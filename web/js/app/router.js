// web/js/app/router.js
/* global App */

'use strict';

App.Router.map(function () {
  this.route('login', {path: 'login'}, function () {});
  this.route('frontpage', {path: '/'}, function () {});
  this.route('sidebar', {path: 'sidebar/:st'}, function () {
    this.resource('summary', {path: 'summary'}, function () {});
    this.resource('detail', {path: 'detail/:cik'}, function () {
      this.resource('board', function () {});
      this.resource('topNews', function () {
        this.resource('omxNews', {path: 'omxNews/:article_id'}, function () {});
      });
      this.resource('previousReg', function () {});
      this.resource('financials', function () {});
      this.resource('delinquency', function () {});
      this.resource('associates', function () {
        this.resource('ner', function () {});
      });
      this.resource('promotions', function () {});
      this.resource('leadership', function () {});
    });
  });
});


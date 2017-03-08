import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function () {
  this.route('login');
  this.route('frontpage');
  this.route('sidebar', {path: 'sidebar/:st'}, function () {
    this.route('summary');
    this.route('detail', {path: 'detail/:cik'}, function () {
      this.route('board');
      this.route('topnews');
      this.route('previousreg');
      this.route('financials');
      this.route('delinquency');
      this.route('associates');
      this.route('promotions');
      this.route('leadership');
    });
  });
});

export default Router;

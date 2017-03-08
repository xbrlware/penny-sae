// app/components/filter-button.js

import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'button',
  classNames: ['btn', 'btn-default', 'fa'],
  classNameBindings: ['colXs2:col-xs-2', 'colXs6:col-xs-6', 'btnXs:btn-xs', 'btnRoundXs:btn-round-xs', 'filterDoc:filter-doc', 'filterMax:filter-max', 'filterPos:filter-pos', 'filterNeut:filter-neut', 'active', 'faChevronUp:fa-chevron-up', 'faChevronDown:fa-chevron-down', 'sentiment', 'numposts', 'filterNeg:filter-neg', 'filterMean:filter-mean', 'togglePos:toggle-pos', 'toggleNeg:toggle-neg', 'toggleNeut:toggle-neut', 'toggleAll:toggle-all', 'toggle', 'filter'],
  title: undefined,
  colXs2: false,
  colXs6: false,
  btnXs: false,
  btnRoundXs: false,
  filterDoc: false,
  filterMax: false,
  filterPos: false,
  filterNeut: false,
  active: false,
  faChevronUp: false,
  faChevronDown: false,
  sentiment: false,
  numposts: false,
  filterNeg: false,
  filterMean: false,
  toggleNeut: false,
  togglePos: false,
  toggleNeg: false,
  toggleAll: false,
  toggle: false,
  filter: false,
  click: function () {
    this.sendAction('action', this.get('param'));
  }
});

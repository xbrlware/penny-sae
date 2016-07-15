// web/js/app/network.js

/* global App, Ember */

App.NetController = Ember.Controller.extend({
  isLoading: true,
  noData: false
});

App.NetView = Ember.View.extend({
  didInsertElement: function () { this.draw(); },
  controllerChanged: function () { this.draw(); }.observes('controller.model'),
  draw: function () {
    var con = this.get('controller');
    var cik = con.get('content.cik');
    var redFlagParams = con.get('redFlagParams');

    App.NetworkAPI.expand_node(con, cik, redFlagParams, true);
  }
});

function zpad (x, n) {
  n = n | 10;
  if (x.length < n) {
    return zpad('0' + x, n);
  } else {
    return x;
  }
}

App.NetworkAPI = Ember.Object.extend({});

App.NetworkAPI.reopenClass({
  _fetch: function (params, cb) {
    Ember.$.ajax({
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      url: 'network',
      data: JSON.stringify(params),
      success: cb
    });
  },
  expand_node: function (con, cik, redFlagParams, init) {
    cik = zpad(cik.toString());
    App.NetworkAPI._fetch({'cik': cik, 'redFlagParams': redFlagParams.get_toggled_params()}, function (data) {
      con.set('rgraph', data);
      con.update_data(data);
    });
  }
});

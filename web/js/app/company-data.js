// web/js/app/company-data.js

App.DetailModel = Ember.Object.extend({
  cik: '',
  source: null,
  fields: null,
  sarreport: null,

  currentName: function () {
    return this.get('fields.currentName')
  }.property('fields'),

  //    score       : null,
  //    rgraph      : null,

  cse_url: function () {
    return 'cse.html?q="' + this.get('currentName') + '"'
  }.property('currentName'),

  // Trading halt information for table
  tradingHalt: function () {
    var th = this.get('source.th')
    if (Object.keys(th).length > 1) {
      var out = []
      for (i = 0; i < th.date.length; i++) {
        var url = th.url[i]
        out.push({'date': th.date[i], 'url': 'http://www.sec.gov' + url})
      }
      return out
    } else {
      return null
    }
  }.property('source'),

  // PVA information for table
  spikesTable: function () {
    var s = this.get('fields.pv_scriptfield')
    if (s != undefined) {
      s = s[0]
      tab = []
      for (i = 0; i < s.spike_size.length; i++) {
        var obj = {
          spike_date: s.spike_dates[i],
          spike_size: s.spike_size[i],
          spike_from: s.spike_from[i],
          spike_to: s.spike_to[i],
          spike_vol: s.spike_vol[i]
        }
        tab.push(obj)
      }
      return (tab)
    } else {
      return null
    }
  }.property('fields'),

  // Financials table
  financialsTable: function () {
    var d = this.get('source.fin')
    if (Object.keys(d).length > 1) {
      tab = []
      for (i = 0; i < d.balance_sheet_date.length; i++) {
        var obj = { }
        obj.bsd = d.balance_sheet_date === undefined ? undefined : d.balance_sheet_date[i]
        obj.type = d.type === undefined ? undefined : d.type[i]
        obj.fy = d.fiscal_year === undefined ? undefined : d.fiscal_year[i]
        obj.revenues = d.revenues === undefined ? undefined : d.revenues[i]
        obj.netincome = d.netincomeloss === undefined ? undefined : d.netincomeloss[i]
        obj.assets = d.assets === undefined ? undefined : d.assets[i]
        obj.revenues_pretty = d.revenues === undefined ? undefined : numeral(d.revenues[i]).format('0,0')
        obj.netincome_pretty = d.netincomeloss === undefined ? undefined : numeral(d.netincomeloss[i]).format('0,0')
        obj.assets_pretty = d.assets === undefined ? undefined : numeral(d.assets[i]).format('0,0')

        tab.push(obj)
      }
      return (tab)
    } else {
      return undefined
    }
  }.property('source'),

  // Delinquency table
  delinquencyTable: function () {
    var d = this.get('source.del_proc')
    if (d != undefined) {
      if (Object.keys(d).length > 1) {
        tab = []

        // Should be fixed on next data load
        d.date_of_filing = [].concat(d.date_of_filing)
        d.due_date = [].concat(d.due_date)
        d.form = [].concat(d.form)
        d.standard_late = [].concat(d.standard_late)

        for (i = 0; i < d.date_of_filing.length; i++) {
          var obj = { }
          obj.dof = d.date_of_filing === undefined ? undefined : d.date_of_filing[i]
          obj.dd = d.due_date === undefined ? undefined : d.due_date[i]
          obj.form = d.form === undefined ? undefined : d.form[i]
          obj.std_late = d.standard_late === undefined ? undefined : d.standard_late[i]
          tab.push(obj)
        }
        return (tab)
      } else {
        return undefined
      }
    } else {
      return undefined
    }
  }.property('source')
})

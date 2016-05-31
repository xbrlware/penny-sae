// Gives unique values, etc, of "type" of metadata

if (_source.company_data != null) {
  var ths = _source.company_data[type]
  if (ths != undefined) {
    var delta = [ths[0]]

    var dates = _source.company_data.date
    var delta_dates = [dates[0]]
    var since = dates[0]

    for (i = 1; i < ths.length; i++) {
      if (ths[i] != delta[delta.length - 1]) {
        delta.push(ths[i])
        delta_dates.push(dates[i])
      }
      if (dates[i] < since) {
        since = dates[i]
      }
    }
  } else {
    delta = []
    delta_dates = []
    since = undefined
  }

  var out = { }
  out.values = delta
  out.nunique = delta.length
  out.nchange = delta.length - 1
  out.dates = delta_dates
  out.since = since
  out
} else {
  null
}

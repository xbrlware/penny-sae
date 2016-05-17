if (_source.fin != null) {
  nlow = 0
  too_high = false

  if (_source.fin != undefined) {
    var fin = _source.fin
    if (type == 'revenues') {
      fin.quantity = fin.revenues
    } else if (type == 'netincomeloss') {
      fin.quantity = fin.netincomeloss
    }

    var now = new Date()
    var then = new Date()
    then.setFullYear(now.getFullYear() - below_for)

    if (fin.balance_sheet_date != undefined) {
      for (i = 0; i < fin.balance_sheet_date.length; i++) {
        var d = new String(fin.balance_sheet_date[i])
        var d = d.split('-')
        var dt = new Date()
        dt.setFullYear(d[0], parseInt(d[1], 10) - 1, d[2])

        if (dt > then) {
          if (fin.quantity[i] <= below) {
            nlow = nlow + 1
          } else {
            too_high = true
          }
        }
      }
    }
  }

  if (too_high) {
    0
  } else {
    nlow
  }
} else {
  null
}

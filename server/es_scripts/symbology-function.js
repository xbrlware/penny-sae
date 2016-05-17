 symbology = function (data, params) {
    var n = 0
    data = data != null ? data : []

    for (i = 0; i < data.length; i++) {
      var field = data[i].field == params.field
      n += (field & time_filter(data[i].new_date, params.min_date, params.max_date))
    }
    return n
  }


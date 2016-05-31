var ths = _source.company_data[type]
if (ths == undefined) {
  false
} else {
  var delta = [ths[0]]
  for (i = 1; i < ths.length; i++) {
    if (ths[i] != delta[delta.length - 1]) {
      delta.push(ths[i])
    }
  }
  delta.length > thresh
}

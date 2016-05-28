var BOOST_CONSTANT = 1000
var cs = _source.tout

var n_word = 0
var n_toutw = 0
if (cs != undefined) {
  var now = new Date()
  var then = new Date()
  then.setMonth(now.getMonth() - past_months)

  // org.elasticsearch.common.logging.Loggers.getLogger("my_logger").info(then)

  if (cs.date != undefined) {
    for (i = 0; i < cs.date.length; i++) {
      var d = new String(cs.date[i])
      var d = d.split('-')
      var dt = new Date()
      dt.setFullYear(d[0], parseInt(d[1]) - 1, d[2])

      // org.elasticsearch.common.logging.Loggers.getLogger("my_logger").info(dt)
      if (dt > then) {
        n_word += cs.n_word[i]
        n_toutw += cs.n_toutw[i]
      }
    }
  }
}

if (n_word > 0) {
  if (type == 'n_toutw') {
    BOOST_CONSTANT + n_toutw
  } else if (n_toutw > 0) {
    if (type == 'p_toutw') {
      BOOST_CONSTANT + (n_toutw / n_word)
    } else {
      1
    }
  } else {
    1
  }
} else {
  1
}

var cs = _source.crowdsar_new
var n_post = 0
var n_susp = 0

if (cs != null) {
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
          n_post = n_post + cs.n_post[i]
          n_susp = n_susp + cs.n_susp[i]
        }
      }
    }
  }

  if (n_post > 0) {
    if (type == 'p_susp') {
      n_susp / n_post
    } else if (type == 'n_post') {
      n_post
    } else if (type == 'n_susp') {
      n_susp
    }
  } else {
    0
  }
} else {
  null
}

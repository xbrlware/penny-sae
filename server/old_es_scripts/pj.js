var pv = _source.pv

var loc = []
var jump = []
for (i = 1; i < pv.date.length; i++) {
  if ((pv.close[i] / pv.close[i - 1]) > rat) {
    jump.push([pv.close[i - 1], pv.close[i]])
    loc.push(pv.date[i])
  }
}

var out = { }
out.date = loc
out.jump = jump
out

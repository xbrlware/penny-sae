<<<<<<< HEAD
function time_filter (a, c, b) {return a > c & a < b;}function delinquency (a, c) {var b = 0,d = null != a;
  a = null != a ? a : []; for (i = 0;i < a.length;i++)b += 1 == a[i].is_late & a[i].form == c.form & time_filter(a[i].deadline, c.min_date, c.max_date);return {value: b,is_flag: b >= c.threshold,have: d};}function otc_neighbors (a, c) {var b = 0,d = !1;
  null != a && (b = Math.round(100 * a.otc_paths / a.total_paths), d = a.total_count >= c.number_of_neighbors[0]);return {value: b,is_flag: 0 < (d & d & b > c.threshold),have: null != a};}function symbology (a, c) {var b = 0,d = null != a;
  a = null != a ? a : []; for (i = 0;i < a.length;i++)b += a[i].field == c.field & time_filter(a[i].new_date, c.min_date, c.max_date);return {value: b,is_flag: b >= c.threshold,have: d};}function combine_scores (a, c) {var b = 0;
  for (s in a)b += a[s].is_flag;return b;}var functions = {symbology: symbology,delinquency: delinquency,otc_neighbors: otc_neighbors};
=======
function time_filter (a, c, b) {return a > c & a < b;}function crowdsar (a, c) {var b = 0,d = null != a;
  if (d) for (i = 0;i < a.length;i++)time_filter(a[i].date, c.min_date, c.max_date) && (b += a[i][c.field]);return {value: b,is_flag: 0 < b,have: d};}function delinquency (a, c) {var b = 0,d = null != a;
  a = null != a ? a : []; for (i = 0;i < a.length;i++)b += 1 == a[i].is_late & a[i].form == c.form & time_filter(a[i].deadline, c.min_date, c.max_date);return {value: b,is_flag: b >= c.threshold,have: d};}function otc_neighbors (a, c) {var b = 0,d = !1;
  null != a && (b = Math.round(100 * a.otc_paths / a.total_paths), d = a.total_count >= c.number_of_neighbors[0]);return {value: b,is_flag: 0 < (d & d & b > c.threshold),have: null != a};}function symbology (a, c) {var b = 0,d = null != a;
  if (d) for (i = 0;i < a.length;i++)b += a[i].field == c.field & time_filter(a[i].new_date, c.min_date, c.max_date);return {value: b,is_flag: b >= c.threshold,have: d};}function combine_scores (a, c) {var b = 0;
  for (s in a)b += a[s].value;return b;}var functions = {symbology: symbology,delinquency: delinquency,otc_neighbors: otc_neighbors,crowdsar: crowdsar};
>>>>>>> bkj-crowdsar-filter
function run () {var a = {};
  for (k in params)kscore = functions[k](_source[k], params[k]), kscore.have && (a[k] = kscore);return score ? combine_scores(a, params) : a;}run();

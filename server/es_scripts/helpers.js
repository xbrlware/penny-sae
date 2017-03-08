function time_filter (date, min_date, max_date) {
  return (date > min_date) & (date < max_date);
}

function num_time_filter (date, min_date, max_date) {
  return (date > Number(min_date)) & (date < Number(max_date));
}

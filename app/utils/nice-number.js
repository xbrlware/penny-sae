// app/utils/nice-number.js

export default function niceNumber (x) {
  return x === undefined ? 'NA' : x.toLocaleString();
}

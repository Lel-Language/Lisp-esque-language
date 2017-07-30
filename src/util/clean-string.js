const unescapeCharacters = (str) =>
  str
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\f/g, '\f')
    .replace(/\\b/g, '\b')
    .replace(/\\t/g, '\t')
    .replace(/\\v/g, '\v')
    .replace(/\\;/, ';');

module.exports = (str) => unescapeCharacters(str.slice(1, str.length - 1));
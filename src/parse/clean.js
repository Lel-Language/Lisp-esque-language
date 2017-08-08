const symbols = require('../symbols');

const unescapeCharacters = (str) =>
  str
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\f/g, '\f')
    .replace(/\\b/g, '\b')
    .replace(/\\t/g, '\t')
    .replace(/\\v/g, '\v')
    .replace(/\\;/, ';');

const cleanString = (str) => unescapeCharacters(str.slice(1, str.length - 1));
const cleanBool = (bool) => (bool === 'true') ? true : false;
const cleanNumber = (number) => parseFloat(number);

module.exports = (token) => {
  if (token.type === symbols.STRING) {
    token.value = cleanString(token.value);
  } else if (token.type === symbols.NUMBER) {
    token.value = cleanNumber(token.value);
  } else if (token.type === symbols.BOOLEAN) {
    token.value = cleanBool(token.value);
  }
  return token;
};

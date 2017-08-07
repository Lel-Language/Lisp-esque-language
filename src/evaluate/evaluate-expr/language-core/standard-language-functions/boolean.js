const createToken = require('../../../../create-token');
const symbols = require('../../../../symbols');

module.exports = {
  '=': (x, y) => {
    return Promise.resolve(createToken(symbols.BOOLEAN, x.value === y.value));
  },
  '<': (x, y) => {
    return Promise.resolve(createToken(symbols.BOOLEAN, x.value < y.value));
  },
  '>': (x, y) => {
    return Promise.resolve(createToken(symbols.BOOLEAN, x.value > y.value));
  },
  '<=': (x, y) => {
    return Promise.resolve(createToken(symbols.BOOLEAN, x.value <= y.value));
  },
  '>=': (x, y) => {
    return Promise.resolve(createToken(symbols.BOOLEAN, x.value >= y.value));
  },
  // NOT
}
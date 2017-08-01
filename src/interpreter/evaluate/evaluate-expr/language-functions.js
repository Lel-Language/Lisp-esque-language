const createToken = require('../../../create-token');
const symbols = require('../../../symbols');

const ZERO = createToken(symbols.NUMBER, 0);
const ONE = createToken(symbols.NUMBER, 1);
const EMPTY_STRING = createToken(symbols.STRING, '');

module.exports = {
  print: (scope, ...items) => {
    const out = items.reduce((acc, item) => {
      if (item.type === symbols.NUMBER || item.type === symbols.BOOLEAN || item.type === symbols.STRING) {
        // Use the primitive
        acc += item.value.toString();
      } else if (item.type === symbols.LIST) {
        // TODO: Implement pretty list
        acc += item.toString();
      } else {
        acc += item.toString();
      }
      return acc;
    }, '');
    process.stdout.write(out);
    return createToken(symbols.STRING, out);
  },
  return: (scope, value) => {
    return value;
  },
  concat: (scope, ...strings) => {
    return strings.reduce(
      (acc, cur) =>
        createToken(symbols.STRING, acc.value + cur.value)
      , EMPTY_STRING
    );
  },

  // String functions
  '+': (scope, ...numbers) => {
    return numbers.reduce(
      (acc, cur) =>
        createToken(symbols.NUMBER, acc.value + cur.value)
      , ZERO);
  },

  // Number functions
  '-': (scope, x, y) => {
    return createToken(symbols.NUMBER, x.value - y.value);
  },
  '/': (scope, x, y) => {
    return createToken(symbols.NUMBER, x.value / y.value);
  },
  '*': (scope, ...numbers) => {
    return numbers.reduce(
      (acc, cur) =>
        createToken(symbols.NUMBER, acc.value * cur.value)
      , ONE);
  },

  // Boolean functions
  '=': (scope, x, y) => {
    return createToken(symbols.BOOLEAN, x.value === y.value);
  },
  '<': (scope, x, y) => {
    return createToken(symbols.BOOLEAN, x.value < y.value);
  },
  '>': (scope, x, y) => {
    return createToken(symbols.BOOLEAN, x.value > y.value);
  },
  '<=': (scope, x, y) => {
    return createToken(symbols.BOOLEAN, x.value <= y.value);
  },
  '>=': (scope, x, y) => {
    return createToken(symbols.BOOLEAN, x.value >= y.value);
  },
};

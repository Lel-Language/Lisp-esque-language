const createToken = require('../../../create-token');
const symbols = require('../../../symbols');

const ZERO = createToken(symbols.NUMBER, 0);
const ONE = createToken(symbols.NUMBER, 1);
const EMPTY_STRING = createToken(symbols.STRING, '');

const prettyString = (token) => {
  if ([symbols.NUMBER, symbols.BOOLEAN, symbols.STRING].includes(token.type)) {
    return token.value.toString();
  } else if (token.type === symbols.LIST) {
    return `(${token.value.map(prettyString).join(', ')})`;
  }
  return token.toString();
};

module.exports = {
  print: (scope, ...items) => {
    const out = items
      .map(prettyString)
      .join('');
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

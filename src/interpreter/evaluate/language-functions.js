const createScope = require('./create-scope');

const scopedFunction = (bodyExpressions = [], expectedArguments = [], scope = {}) => ({
  isFunction: true,
  bodyExpressions,
  expectedArguments,
  scope
});

module.exports = {
  print: (scope, ...values) => {
    values.forEach(value => process.stdout.write(value.toString()));
  },
  list: (scope, ...items) => {
    return items;
  },
  '+': (scope, ...numbers) => {
    return numbers.reduce((acc, cur) => acc + cur, 0);
  },
  '-': (scope, x, y) => {
    return x - y;
  },
  '/': (scope, x, y) => {
    return x / y;
  },
  '*': (scope, x, y) => {
    return x * y;
  }
};

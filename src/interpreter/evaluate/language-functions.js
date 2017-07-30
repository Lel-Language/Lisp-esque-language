const createScope = require('./create-scope');

const scopedFunction = (bodyExpressions = [], expectedArguments = [], scope = {}) => [
  func,
  expectedArguments,
  scope
];

module.exports = {
  print: (scope, ...values) => {
    values.forEach(value => process.stdout.write(value.toString()));
  },
  let: (scope, name, value) => {
    if (name in scope.variables) {
      throw new Error(`Error. Can't overwrite previously assigned scoped variable '${name}'`);
    }
    if (name in scope.functions) {
      throw new Error(`Error. Can't overwrite scoped function '${name}' with variable declaration.`);
    }
    scope.variables[name] = value;
  },
  function: (scope, name, expectedArguments, bodyExpressions) => {
    const functionScope = createScope(scope);
    scope.functions[name] = scopedFunction(bodyExpressions, expectedArguments, functionScope);
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

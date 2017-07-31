module.exports = {
  print: (scope, ...values) => {
    values.forEach(value => process.stdout.write(value.toString()));
  },
  return: (scope, value) => {
    return value;
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
  '*': (scope, ...numbers) => {
    return numbers.reduce((acc, cur) => acc * cur, 1);
  },
  '=': (scope, x, y) => {
    return x === y;
  },
  '<': (scope, x, y) => {
    return x < y;
  },
  '>': (scope, x, y) => {
    return x > y;
  },
  '<=': (scope, x, y) => {
    return x <= y;
  },
  '>=': (scope, x, y) => {
    return x >= y;
  },
};

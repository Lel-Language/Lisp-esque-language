module.exports = {
  print: (scope, ...values) => {
    values.forEach(value => process.stdout.write(value.toString()));
  },
  list: (scope, ...items) => {
    return items;
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
  '*': (scope, x, y) => {
    return x * y;
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

const createToken = require('../../../../create-token');
const symbols = require('../../../../symbols');

const ZERO = createToken(symbols.NUMBER, 0);
const ONE = createToken(symbols.NUMBER, 1);

const lelReject = require('../../../../util/lel-reject');

module.exports = {
  '+': (...numbers) => {
    if (numbers.filter(n => n.type !== symbols.NUMBER).length !== 0) {
      return Promise
        .reject(new Error(`+ only operates on NUMBER type`))
        .catch(console.error);
    }
    return Promise.resolve(numbers.reduce(
      (acc, cur) =>
        createToken(symbols.NUMBER, acc.value + cur.value)
      , ZERO));
  },
  '-': (x, y) => {
    if (x.type !== symbols.NUMBER || y.type !== symbols.NUMBER) {
      return Promise
        .reject(new Error(`- only operates on NUMBER type`))
        .catch(console.error);
    }
    return Promise.resolve(createToken(symbols.NUMBER, x.value - y.value));
  },
  '/': (x, y) => {
    if (x.type !== symbols.NUMBER || y.type !== symbols.NUMBER) {
      return Promise
        .reject(new Error(`/ only operates on NUMBER type`))
        .catch(console.error);
    }
    if (y.value === 0) {
      return Promise
        .reject(new Error(`Divison by zero error`))
        .catch(console.error);
    }
    return Promise.resolve(createToken(symbols.NUMBER, x.value / y.value));
  },
  '*': (...numbers) => {
    if (numbers.filter(n => n.type !== symbols.NUMBER).length !== 0) {
      return Promise
        .reject(new Error(`* only operates on NUMBER type`))
        .catch(console.error);
    }
    return Promise.resolve(numbers.reduce(
      (acc, cur) =>
        createToken(symbols.NUMBER, acc.value * cur.value)
      , ONE));
  },
  '**': (x, y) => {
    if (x.type !== symbols.NUMBER || y.type !== symbols.NUMBER) {
      return Promise
        .reject(new Error(`** only operates on NUMBER type`))
        .catch(console.error);
    }
    return Promise.resolve(createToken(symbols.NUMBER, Math.pow(x.value, y.value)));
  },
  '%': (x, y) => {
    if (x.type !== symbols.NUMBER || y.type !== symbols.NUMBER) {
      return Promise
        .reject(new Error(`% only operates on NUMBER type`))
        .catch(console.error);
    }
    if (y.value === 0) {
      return Promise
        .reject(new Error(`Divison by zero error`))
        .catch(console.error);
    }
    return Promise.resolve(createToken(symbols.NUMBER, x.value % y.value));
  },
  '<<': (x, y) => {
    if (x.type !== symbols.NUMBER || y.type !== symbols.NUMBER) {
      return lelReject(new Error(`<< only operates on NUMBER type`));
    }
    return Promise.resolve(createToken(symbols.NUMBER, x.value << y.value));
  },
  '>>': (x, y) => {
    if (x.type !== symbols.NUMBER || y.type !== symbols.NUMBER) {
      return lelReject(new Error(`>> only operates on NUMBER type`));
    }
    return Promise.resolve(createToken(symbols.NUMBER, x.value >> y.value));
  },
  '|': (x, y) => {
    if (x.type !== symbols.NUMBER || y.type !== symbols.NUMBER) {
      return lelReject(new Error(`| only operates on NUMBER type`));
    }
    return Promise.resolve(createToken(symbols.NUMBER, x.value | y.value));
  },
  '&': (x, y) => {
    if (x.type !== symbols.NUMBER || y.type !== symbols.NUMBER) {
      return lelReject(new Error(`& only operates on NUMBER type`));
    }
    return Promise.resolve(createToken(symbols.NUMBER, x.value & y.value));
  },
  '^': (x, y) => {
    if (x.type !== symbols.NUMBER || y.type !== symbols.NUMBER) {
      return lelReject(new Error(`^ only operates on NUMBER type`));
    }
    return Promise.resolve(createToken(symbols.NUMBER, x.value ^ y.value));
  },
  '~': (x) => {
    if (x.type !== symbols.NUMBER) {
      return lelReject(new Error(`^ only operates on NUMBER type`));
    }
    return Promise.resolve(createToken(symbols.NUMBER, ~x.value));
  }
}
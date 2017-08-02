const createToken = require('../../../../create-token');
const symbols = require('../../../../symbols');

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
  print: (...items) => {
    const out = items
      .map(prettyString)
      .join('');
    process.stdout.write(out);
    return createToken(symbols.STRING, out);
  },
  return: (value) => {
    return value;
  },
  concat: (...concatables) => {
    if (concatables.length) {
      const type = concatables[0].type;
      const allSameType = concatables.filter(concatable => concatable.type !== type).length === 0;

      if (type == symbols.STRING && allSameType) {
        return concatables.reduce(
          (acc, cur) =>
            createToken(symbols.STRING, acc.value + cur.value)
          , EMPTY_STRING
        );
      } else if (type === symbols.LIST && allSameType) {
        const concatenatedLists = concatables.reduce((acc, list) =>
          [...acc, ...list.value]
          , []
        );
        return createToken(symbols.LIST, concatenatedLists);
      } else {
        throw new Error(`concat requires all arguments to be either STRING or LIST`);
      }
    }
    return createToken(symbols.LIST, []);
  },

  // Number functions
  '+': (...numbers) => {
    if (numbers.filter(n => n.type !== symbols.NUMBER).length !== 0) {
      throw new Error(`+ only operates on NUMBER type`)
    }
    return numbers.reduce(
      (acc, cur) =>
        createToken(symbols.NUMBER, acc.value + cur.value)
      , ZERO);
  },
  '-': (x, y) => {
    if (x.type !== symbols.NUMBER || y.type !== symbols.NUMBER) {
      throw new Error(`- only operates on NUMBER type`);
    }
    return createToken(symbols.NUMBER, x.value - y.value);
  },
  '/': (x, y) => {
    if (x.type !== symbols.NUMBER || y.type !== symbols.NUMBER) {
      throw new Error(`/ only operates on NUMBER type`);
    }
    return createToken(symbols.NUMBER, x.value / y.value);
  },
  '*': (...numbers) => {
    if (numbers.filter(n => n.type !== symbols.NUMBER).length !== 0) {
      throw new Error(`+ only operates on NUMBER type`)
    }
    return numbers.reduce(
      (acc, cur) =>
        createToken(symbols.NUMBER, acc.value * cur.value)
      , ONE);
  },

  // Boolean functions
  '=': (x, y) => {
    return createToken(symbols.BOOLEAN, x.value === y.value);
  },
  '<': (x, y) => {
    return createToken(symbols.BOOLEAN, x.value < y.value);
  },
  '>': (x, y) => {
    return createToken(symbols.BOOLEAN, x.value > y.value);
  },
  '<=': (x, y) => {
    return createToken(symbols.BOOLEAN, x.value <= y.value);
  },
  '>=': (x, y) => {
    return createToken(symbols.BOOLEAN, x.value >= y.value);
  },


  // List functions
  length: (list) => {
    if (list.type === symbols.LIST) {
      return createToken(symbols.NUMBER, list.value.length);
    }
    throw new Error(`length operates on LIST type. Got ${list.type}`);
  },
  head: (list) => {
    if (list.type === symbols.LIST) {
      const listHead = list.value.slice(0,1)[0];
      return (typeof listHead !== 'undefined')
        ? listHead
        : createToken(symbols.LIST, []);
    }
    throw new Error(`head operates on LIST type. Got ${list.type}`);
  },
  tail: (list) => {
    // Check is list
    if (list.type === symbols.LIST) {
      return createToken(symbols.LIST, list.value.slice(1));
    }
    throw new Error(`tail operates on LIST type. Got ${list.type}`);
  },
  nth: (list, n) => {
    if (list.type === symbols.LIST) {
      if (n.value > 0 && n.value < list.value.length) {
        return list.value.slice(n.value, n.value + 1)[0];
      }
      throw new Error(`nth: bad index ${n.value}. Given list has ${list.value.length} elements`);
    }
    throw new Error(`nth operates on LIST type. Got ${list.type}`);
  },
  sublist: (list, start, end) => {
    if (list.type === symbols.LIST) {
      const listLength = list.value.length;
      const s = start.value;
      const e = end.value;

      if (s > e) {
        throw new Error(`start index cannot be greater than the end index for a sublist`);
      }

      if (s < 0 ||  e > listLength - 1) {
        throw new Error(`sublist indexes out of range. Got start (${s}) end (${e}) for list of length ${listLength}`);
      }

      return createToken(symbols.LIST, list.value.slice(s, e+1));
    }
    throw new Error(`sublist operates on LIST type. Got ${list.type}`);
  }
};

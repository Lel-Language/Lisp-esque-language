const createToken = require('../../../../create-token');
const symbols = require('../../../../symbols');

const ZERO = createToken(symbols.NUMBER, 0);
const ONE = createToken(symbols.NUMBER, 1);
const EMPTY_STRING = createToken(symbols.STRING, '');
const EMPTY_LIST = createToken(symbols.LIST);

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
    return Promise.resolve(createToken(symbols.STRING, out));
  },
  cls: () => {
    process.stdout.write('\033c');
    return Promise.resolve(EMPTY_LIST);
  },
  return: (value) => {
    return Promise.resolve(value);
  },
  concat: (...concatables) => {
    if (concatables.length) {
      const type = concatables[0].type;
      const allSameType = concatables.filter(concatable => concatable.type !== type).length === 0;

      if (type == symbols.STRING && allSameType) {
        return Promise.resolve(concatables.reduce(
          (acc, cur) =>
            createToken(symbols.STRING, acc.value + cur.value)
          , EMPTY_STRING
        ));
      } else if (type === symbols.LIST && allSameType) {
        const concatenatedLists = concatables.reduce((acc, list) =>
          [...acc, ...list.value]
          , []
        );
        return Promise.resolve(createToken(symbols.LIST, concatenatedLists));
      } else {
        throw new Error(`concat requires all arguments to be either STRING or LIST`);
      }
    }
    Promise.resolve(createToken(symbols.LIST, []));
  },
  split: (string) => {
    if (string !== symbols.STRING) {
      throw new Error(`Can't split non-strings. Got ${string.type}`);
    }
    return Promise.resolve(createToken(
      symbols.LIST,
      string.value
        .split('')
        .map(char => createToken(symbols.STRING, char)))
    );
  },

  // Number functions
  '+': (...numbers) => {
    if (numbers.filter(n => n.type !== symbols.NUMBER).length !== 0) {
      throw new Error(`+ only operates on NUMBER type`);
    }
    return Promise.resolve(numbers.reduce(
      (acc, cur) =>
        createToken(symbols.NUMBER, acc.value + cur.value)
      , ZERO));
  },
  '-': (x, y) => {
    if (x.type !== symbols.NUMBER || y.type !== symbols.NUMBER) {
      throw new Error(`- only operates on NUMBER type`);
    }
    return Promise.resolve(createToken(symbols.NUMBER, x.value - y.value));
  },
  '/': (x, y) => {
    if (x.type !== symbols.NUMBER || y.type !== symbols.NUMBER) {
      throw new Error(`/ only operates on NUMBER type`);
    }
    return Promise.resolve(createToken(symbols.NUMBER, x.value / y.value));
  },
  '*': (...numbers) => {
    if (numbers.filter(n => n.type !== symbols.NUMBER).length !== 0) {
      throw new Error(`+ only operates on NUMBER type`);
    }
    return Promise.resolve(numbers.reduce(
      (acc, cur) =>
        createToken(symbols.NUMBER, acc.value * cur.value)
      , ONE));
  },
  'sin': (number) => {
    if (number.type !== symbols.NUMBER) {
      throw new Error(`sin only operates on NUMBER type`);
    }
    return Promise.resolve(createToken(symbols.NUMBER, Math.sin(number.value)));
  },

  // Boolean functions
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


  // List functions
  join: (list) => {
    if (list !== symbols.LIST) {
      throw new Error(`Can't join non-lists. Got ${list.type}`);
    }
    return Promise.resolve(createToken(
      symbols.STRING,
      list.value
        .map(listItem => listItem.value)
        .join('')
    ));
  },
  length: (list) => {
    if (list.type === symbols.LIST) {
      return Promise.resolve(createToken(symbols.NUMBER, list.value.length));
    }
    throw new Error(`length operates on LIST type. Got ${list.type}`);
  },
  head: (list) => {
    if (list.type === symbols.LIST) {
      const listHead = list.value.slice(0,1)[0];
      return Promise.resolve((typeof listHead !== 'undefined')
        ? listHead
        : createToken(symbols.LIST, []));
    }
    throw new Error(`head operates on LIST type. Got ${list.type}`);
  },
  tail: (list) => {
    // Check is list
    if (list.type === symbols.LIST) {
      return Promise.resolve(createToken(symbols.LIST, list.value.slice(1)));
    }
    throw new Error(`tail operates on LIST type. Got ${list.type}`);
  },
  nth: (list, n) => {
    if (list.type === symbols.LIST) {
      if (n.value > 0 && n.value < list.value.length) {
        return Promise.resolve(list.value.slice(n.value, n.value + 1)[0]);
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

      return Promise.resolve(createToken(symbols.LIST, list.value.slice(s, e+1)));
    }
    throw new Error(`sublist operates on LIST type. Got ${list.type}`);
  }
};

const createToken = require('../../../../create-token');
const symbols = require('../../../../symbols');
const lelReject = require('../../../../util/lel-reject');

module.exports = {
  // List functions
  join: (list) => {
    if (list.type !== symbols.LIST) {
      return lelReject(new Error(`Can't join non-lists. Got ${list.type}`));
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
    return lelReject(new Error(`length operates on LIST type. Got ${list.type}`));
  },
  head: (list) => {
    if (list.type === symbols.LIST) {
      const listHead = list.value.slice(0,1)[0];
      return Promise.resolve((typeof listHead !== 'undefined')
        ? listHead
        : createToken(symbols.LIST, []));
    }
    return lelReject(new Error(`head operates on LIST type. Got ${list.type}`));
  },
  tail: (list) => {
    // Check is list
    if (list.type === symbols.LIST) {
      return Promise.resolve(createToken(symbols.LIST, list.value.slice(1)));
    }
    return lelReject(new Error(`tail operates on LIST type. Got ${list.type}`));
  },
  nth: (list, n) => {
    if (list.type === symbols.LIST) {
      if (n.value > 0 && n.value < list.value.length) {
        return Promise.resolve(list.value.slice(n.value, n.value + 1)[0]);
      }
      return lelReject(new Error(`nth: bad index ${n.value}. Given list has ${list.value.length} elements`));
    }
    return lelReject(new Error(`nth operates on LIST type. Got ${list.type}`));
  },
  sublist: (list, start, end) => {
    if (list.type === symbols.LIST) {
      const listLength = list.value.length;
      const s = start.value;
      const e = end.value;

      if (s > e) {
        return lelReject(new Error(`start index cannot be greater than the end index for a sublist`));
      }

      if (s < 0 ||  e > listLength - 1) {
        return lelReject(new Error(`sublist indexes out of range. Got start (${s}) end (${e}) for list of length ${listLength}`));
      }

      return Promise.resolve(createToken(symbols.LIST, list.value.slice(s, e+1)));
    }
    return lelReject(new Error(`sublist operates on LIST type. Got ${list.type}`));
  }
};

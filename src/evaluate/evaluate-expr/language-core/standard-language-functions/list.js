const createToken = require('../../../../create-token');
const symbols = require('../../../../symbols');

module.exports = {
  // List functions
  join: (list) => {
    if (list !== symbols.LIST) {
      Promise
        .reject(new Error(`Can't join non-lists. Got ${list.type}`))
        .catch(console.error);
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
    Promise
      .reject(new Error(`length operates on LIST type. Got ${list.type}`))
      .catch(console.error);
  },
  head: (list) => {
    if (list.type === symbols.LIST) {
      const listHead = list.value.slice(0,1)[0];
      return Promise.resolve((typeof listHead !== 'undefined')
        ? listHead
        : createToken(symbols.LIST, []));
    }
    Promise
      .reject(new Error(`head operates on LIST type. Got ${list.type}`))
      .catch(console.error);
  },
  tail: (list) => {
    // Check is list
    if (list.type === symbols.LIST) {
      return Promise.resolve(createToken(symbols.LIST, list.value.slice(1)));
    }
    Promise
      .reject(new Error(`tail operates on LIST type. Got ${list.type}`))
      .catch(console.error);
  },
  nth: (list, n) => {
    if (list.type === symbols.LIST) {
      if (n.value > 0 && n.value < list.value.length) {
        return Promise.resolve(list.value.slice(n.value, n.value + 1)[0]);
      }
      Promise
        .reject(new Error(`nth: bad index ${n.value}. Given list has ${list.value.length} elements`))
        .catch(console.error);
    }
    Promise
      .reject(new Error(`nth operates on LIST type. Got ${list.type}`))
      .catch(console.error);
  },
  sublist: (list, start, end) => {
    if (list.type === symbols.LIST) {
      const listLength = list.value.length;
      const s = start.value;
      const e = end.value;

      if (s > e) {
        Promise
          .reject(new Error(`start index cannot be greater than the end index for a sublist`))
          .catch(console.error);
      }

      if (s < 0 ||  e > listLength - 1) {
        Promise
          .reject(new Error(`sublist indexes out of range. Got start (${s}) end (${e}) for list of length ${listLength}`))
          .catch(console.error);
      }

      return Promise.resolve(createToken(symbols.LIST, list.value.slice(s, e+1)));
    }
    Promise
      .reject(new Error(`sublist operates on LIST type. Got ${list.type}`))
      .catch(console.error);
  }
}
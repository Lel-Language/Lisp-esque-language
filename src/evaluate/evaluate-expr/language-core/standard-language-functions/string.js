const createToken = require('../../../../create-token');
const symbols = require('../../../../symbols');

module.exports = {
  split: (string) => {
    if (string !== symbols.STRING) {
      return Promise
        .reject(new Error(`Can't split non-strings. Got ${string.type}`))
        .catch(console.error);
    }
    return Promise.resolve(createToken(
      symbols.LIST,
      string.value
        .split('')
        .map(char => createToken(symbols.STRING, char)))
    );
  }
};

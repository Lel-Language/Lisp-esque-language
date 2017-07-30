const symbols = require('./symbols');

module.exports = [
  [/^[\s\n]+$/, symbols.SKIP],
  [/^\($/, symbols.LPAREN],
  [/^\)$/, symbols.RPAREN],
  [/^[0-9]+$/, symbols.NUMBER],
  [/^\"[^\n\"]*\"$/, symbols.STRING],
  [/^(T|F)$/, symbols.BOOLEAN],
  [/^[a-zA-Z\+\-\/\*\_\>\<=]*$/, symbols.IDENTIFIER],
];

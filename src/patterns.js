const symbols = require('./symbols');

module.exports = [
  [/^[\s\n]+$/, symbols.SKIP],
  [/^\($/, symbols.LPAREN],
  [/^\)$/, symbols.RPAREN],
  [/^[a-zA-Z\+\-\/\*\_][a-zA-Z0-9\+\-\/\*\_]*$/, symbols.IDENTIFIER],
  [/^[0-9]+$/, symbols.NUMBER],
  [/^\"[^\n\"]*\"$/, symbols.STRING]
];

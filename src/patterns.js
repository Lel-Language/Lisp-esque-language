const symbols = require('./symbols');

module.exports = [
  [/^\s+$/, symbols.SKIP],
  [/^\n$/, symbols.NEWLINE],
  [/^\($/, symbols.LPAREN],
  [/^\)$/, symbols.RPAREN],
  [/^[a-zA-Z][a-zA-Z0-9\-\_]*$/, symbols.IDENTIFIER],
  [/^[0-9]+$/, symbols.NUMBER],
  [/^\"[^\n\"]*\"$/, symbols.STRING]
];

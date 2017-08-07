const symbols = require('./symbols');

module.exports = [
  // Whitespace
  [/^[\s\n]+$/, symbols.SKIP],

  // Comments
  [/^;.+?\n$/, symbols.SKIP],

  // Parentheses
  [/^\($/, symbols.LPAREN],
  [/^\)$/, symbols.RPAREN],

  // Primitives
  [/^\-?[0-9]+\.?[0-9]*$/, symbols.NUMBER],
  [/^\"[^\n\"]*\"$/, symbols.STRING],
  [/^\#(true|false)$/, symbols.BOOLEAN],

  // Identifier
  [/^[a-zA-Z\+\-\/\*\_\>\<=]*$/, symbols.IDENTIFIER],
];

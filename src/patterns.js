const symbols = require('./symbols');

const number = [/^\-?[0-9]+\.?[0-9]*$/, symbols.NUMBER];
const string = [/^\"[^\n\"]*\"$/, symbols.STRING];
const boolean = [/^\#(true|false)$/, symbols.BOOLEAN];
const whitespace = [/^[\s\n]+$/, symbols.SKIP];
const comment = [/^;.+?\n$/, symbols.SKIP];
const lparen = [/^\($/, symbols.LPAREN];
const rparen = [/^\)$/, symbols.RPAREN];
const identifier = [/^[a-zA-Z\+\-\/\*\%\_\>\<=]*$/, symbols.IDENTIFIER];

module.exports = {
  ambiguous: [
    [/^\-$/, number]
  ],
  tokens: [
    whitespace,
    comment,
    lparen,
    rparen,
    number,
    string,
    boolean,
    identifier
  ]
};

const symbols = require('./symbols');

const number = [/^\-?[0-9]+\.?[0-9]*$/, symbols.NUMBER];
const string = [/^\"[^\n\"]*\"$/, symbols.STRING];
const whitespace = [/^[\s\n]+$/, symbols.SKIP];
const comment = [/^;.+?\n$/, symbols.SKIP];
const identifier = [/^[a-zA-Z\+\-\/\*\%\_\>\<\&\^\~\|=]*$/, symbols.IDENTIFIER];
const boolTrue = ['true', symbols.BOOLEAN];
const boolFalse = ['false', symbols.BOOLEAN];
const lparen = ['(', symbols.LPAREN];
const rparen = [')', symbols.RPAREN];
const range = ['..', symbols.RANGE];

module.exports = {
  ambiguous: [
    [/^\-$/, number]
  ],
  exact: [
    boolTrue,
    boolFalse,
    lparen,
    rparen,
    range
  ],
  tokens: [
    whitespace,
    comment,
    number,
    string,
    identifier
  ]
};

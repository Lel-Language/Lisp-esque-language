const SKIP = 'SKIP';
const NEWLINE = 'SKIP';
const LPAREN = 'LPAREN';
const RPAREN = 'RPAREN';
const IDENTIFIER = 'IDENTIFIER';
const NUMBER = 'NUMBER';
const STRING = 'STRING';
const EOF = 'EOF';

module.exports = [
  [/^\s+$/, SKIP],
  [/^\n$/, NEWLINE],
  [/^\($/, LPAREN],
  [/^\)$/, RPAREN],
  [/^[a-zA-Z][a-zA-Z0-9\-\_]*$/, IDENTIFIER],
  [/^[0-9]+$/, NUMBER],
  [/^\"[^\n\"]*\"$/, STRING]
];

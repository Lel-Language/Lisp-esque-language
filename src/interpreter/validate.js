const {
  LPAREN,
  RPAREN
} = require('../symbols');

// Ensure matching parentheses
module.exports = (tokens) => {
  const left = tokens.filter(token => token.type === LPAREN).length;
  const right = tokens.filter(token => token.type === RPAREN).length;
  if (left !== right) {
    throw new Error('Unmatched parentheses.');
  }
  return tokens;
};
const {
  LPAREN,
  RPAREN
} = require('../symbols');

// Ensure matching parentheses
module.exports = (tokens) => {
  const left = tokens.filter(token => token[1] === LPAREN).length;
  const right = tokens.filter(token => token[1] === RPAREN).length;
  if (left !== right) {
    throw new Error('Error. Unmatched parentheses.');
  }
  return tokens;
};
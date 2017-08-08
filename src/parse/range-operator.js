const symbols = require('../symbols');
const createToken = require('../create-token');

module.exports = (addTokenToExprTree, ast, tokens, i) => {
  const next = tokens[i+1];
  const prev = tokens[i-1];
  if (prev.type !== symbols.NUMBER || next.type !== symbols.NUMBER) {
    throw new Error('Cannot make range from non-number')
  }

  const rangeDirection = (prev.value < next.value) ? true : false;
  const start = (rangeDirection) ? (prev.value + 1) : next.value;
  const end = (rangeDirection) ? next.value : (prev.value - 1);
  const expandedRange = [];

  for (let j = start; j <= end; j++) {
    expandedRange.push(createToken(symbols.NUMBER, j));
  }
  if (!rangeDirection) expandedRange.reverse();
  expandedRange.forEach(t => addTokenToExprTree(ast, t));
}

const symbols = require('../../../symbols');
const createToken = require('../../../create-token');
const lelPromise = require('../../../util/lel-promise');

const expandRanges = values => {
  const foundRange = values.some(value => value.type === symbols.RANGE);
  if (foundRange) {
    if (values.length !== 3) {
      throw new Error('List with range operator requires exactly 3 arguments');
    }

    const prev = values[0];
    const next = values[2];
    if (prev.type !== symbols.NUMBER || next.type !== symbols.NUMBER) {
      throw new Error('Cannot make range from non-number');
    }

    const rangeDirection = (prev.value < next.value);
    const start = (rangeDirection) ? prev.value : next.value;
    const end = (rangeDirection) ? next.value : prev.value;
    const expandedRange = [];

    for (let j = start; j <= end; j++) {
      expandedRange.push(createToken(symbols.NUMBER, j));
    }
    if (!rangeDirection) expandedRange.reverse();
    return createToken(symbols.LIST, expandedRange);
  }

  return createToken(symbols.LIST, values);
};

module.exports = (evaluateExpr, scope, expr) =>
  lelPromise((resolve, reject) => {
    Promise
      .all(
        expr
          .slice(1)
          .map(subExpr => evaluateExpr(scope, subExpr))
      )
      .then(expandRanges)
      .then(resolve)
      .catch(console.error);
  });

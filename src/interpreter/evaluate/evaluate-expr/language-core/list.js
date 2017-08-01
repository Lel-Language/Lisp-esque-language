const symbols = require('../../../../symbols');
const createToken = require('../../../../create-token');

module.exports = (evaluateExpr, scope, expr) => {
  const evaluatedList = expr
    .slice(1)
    .map(subExpr => evaluateExpr(scope, subExpr));

  return createToken(symbols.LIST, evaluatedList);
};

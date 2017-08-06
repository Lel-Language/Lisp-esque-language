const symbols = require('../../../../symbols');
const createToken = require('../../../../create-token');
const lelPromise = require('../../../../util/lel-promise');

module.exports = (evaluateExpr, scope, expr) =>
  lelPromise((resolve, reject) => {
    Promise
      .all(
        expr
          .slice(1)
          .map(subExpr => evaluateExpr(scope, subExpr))
      )
      .catch(console.error)
      .then(values => resolve(createToken(symbols.LIST, values)));
  });

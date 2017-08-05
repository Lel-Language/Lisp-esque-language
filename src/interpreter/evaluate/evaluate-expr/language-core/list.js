const symbols = require('../../../../symbols');
const createToken = require('../../../../create-token');

module.exports = (evaluateExpr, scope, expr) =>
  new Promise((resolve, reject) => {
    Promise
      .all(expr
        .slice(1)
        .map(subExpr => evaluateExpr(scope, subExpr).catch(console.error))
      )
      .then(values => resolve(createToken(symbols.LIST, values)));
  }).catch(console.error);

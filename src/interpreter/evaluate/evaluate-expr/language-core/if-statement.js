const lelPromise = require('../../../../util/lel-promise');

module.exports = (evaluateExpr, scope, expr) =>
  lelPromise((resolve, reject) => {
    if (expr.length < 4) {
      reject(new Error(`Conditional expressions require 3 arguments. Got ${expr.length} at expression ${JSON.stringify(expr)}`));
    }

    evaluateExpr(scope, expr[1])
      .then(conditionResult => {
        const branch = (conditionResult.value) ? expr[2] : expr[3];
        evaluateExpr(scope, branch).then(resolve);
      });
  });

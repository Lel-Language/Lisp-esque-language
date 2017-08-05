module.exports = (evaluateExpr, scope, expr) =>
  new Promise((resolve, reject) => {
    if (expr.length < 4) {
      throw new Error(`Conditional expressions require 3 arguments. Got ${expr.length} at expression ${JSON.stringify(expr)}`);
    }

    evaluateExpr(scope, expr[1])
      .catch(console.error)
      .then(conditionResult => {
        const branch = (conditionResult.value) ? expr[2] : expr[3];
        evaluateExpr(scope, branch)
          .catch(console.error)
          .then(resolve);
      });
  }).catch(console.error);

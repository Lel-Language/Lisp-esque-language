module.exports = (evaluateExpr, scope, expr) => {
  if (expr.length < 4) {
    throw new Error(`Conditional expressions require 3 arguments. Got ${expr.length} at expression ${JSON.stringify(expr)}`);
  }
  const conditionResult = evaluateExpr(scope, expr[1]);
  if (conditionResult) return evaluateExpr(scope, expr[2]);
  return evaluateExpr(scope, expr[3]);
}
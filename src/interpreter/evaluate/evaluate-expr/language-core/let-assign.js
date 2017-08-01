const symbols = require('../../../../symbols');

module.exports = (evaluateExpr, scope, expr) => {
  if (expr[1].type !== symbols.IDENTIFIER) {
    throw new Error(`Variable name must be an IDENTIFER. Got ${expr[1].type} for ${expr[1].value}`);
  }
  const name = expr[1].value;
  const value = evaluateExpr(scope, expr[2]);

  if (name in scope.variables) {
    throw new Error(`Can't mutate previously assigned scoped variable '${name}'`);
  }
  if (name in scope.functions) {
    throw new Error(`Can't mutate scoped function '${name}' with variable declaration.`);
  }
  scope.variables[name] = value;
  return value;
}
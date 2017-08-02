const symbols = require('../../../../symbols');

module.exports = (evaluateExpr, scope, expr) => {
  if (expr[1].type !== symbols.IDENTIFIER) {
    throw new Error(`Variable name must be an IDENTIFER. Got ${expr[1].type} for ${expr[1].value}`);
  }
  const name = expr[1].value;
  const value = evaluateExpr(scope, expr[2]);

  if (!(name in scope.variables)) {
    throw new Error(`No variable '${name}' to mutate in the local scope`);
  }

  scope.variables[name] = value;
  return value;
};
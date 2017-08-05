const symbols = require('../../../../symbols');

module.exports = (evaluateExpr, scope, expr) => 
  new Promise((resolve, reject) => {
    if (expr[1].type !== symbols.IDENTIFIER) {
      throw new Error(`Variable name must be an IDENTIFER. Got ${expr[1].type} for ${expr[1].value}`);
    }
    const name = expr[1].value;
    evaluateExpr(scope, expr[2])
      .catch(console.error)
      .then(value => {
        if (name in scope.variables) {
          throw new Error(`Can't implicitly mutate previously assigned scoped variable '${name}'`);
        }
        scope.variables[name] = value;
        resolve(value);
      });
  }).catch(console.error);
const symbols = require('../../../symbols');
const lelPromise = require('../../../util/lel-promise');

module.exports = (evaluateExpr, scope, expr) =>
  lelPromise((resolve, reject) => {
    if (expr[1].type !== symbols.IDENTIFIER) {
      reject(new Error(`Variable name must be an IDENTIFIER. Got ${expr[1].type} for ${expr[1].value}`));
    }
    evaluateExpr(scope, expr[2])
      .then(value => {
        const name = expr[1].value;
        if (!(name in scope.variables)) {
          reject(new Error(`No variable '${name}' to mutate in the local scope`));
        }

        scope.variables[name] = value;
        resolve(value);
      });
  });

const symbols = require('../../../symbols');
const lelPromise = require('../../../util/lel-promise');

module.exports = (use) =>
  (evaluateExpr, scope, expr) =>
    lelPromise((resolve, reject) => {
      // Evaluate the libName
      evaluateExpr(scope, expr[1])
        .then(libName => {
          if (libName.type === symbols.STRING) {
            use(libName.value);
            return resolve(libName);
          } else {
            reject(new Error(`use: library name must resolve to a string. Got ${libName}`));
          }
        });
    });

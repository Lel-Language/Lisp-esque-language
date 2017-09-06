const createToken = require('../../../../create-token');
const symbols = require('../../../../symbols');
const lelPromise = require('../../../../util/lel-promise');
const lelPromiseAll = require('../../../../util/lel-promise-all');

module.exports = {
  'math-sin': (evaluateExpr, scope, expr) =>
    lelPromise((resolve, reject) => {
      return evaluateExpr(scope, expr[1]).then(number => {
        if (number.type !== symbols.NUMBER) {
          return reject(new Error(`math-sin only operates on NUMBER type`));
        }
        return resolve(createToken(symbols.NUMBER, Math.sin(number.value)))
      });
    }),
  'math-cos': (evaluateExpr, scope, expr) =>
    lelPromise((resolve, reject) => {
      return evaluateExpr(scope, expr[1]).then(number => {
        if (number.type !== symbols.NUMBER) {
          return reject(new Error(`math-cos only operates on NUMBER type`));
        }
        return resolve(createToken(symbols.NUMBER, Math.cos(number.value)))
      });
    })
};

const {readFileSync} = require('fs');
const path = require('path');
const findBasepath = require('../evaluate/evaluate-expr/find-basepath');

const symbols = require('../symbols');
const createToken = require('../create-token');
const lelPromise = require('../util/lel-promise');
const lelPromiseAll = require('../util/lel-promise-all');

module.exports = (evaluateExpr, scope, expr) =>
  lelPromise((resolve, reject) => {
    if (!(expr[1] && expr[2])) {
      reject(new Error(`Requires filename and encoding. Got ${expr[1]} and ${expr[2]}`));
    }

    lelPromiseAll([evaluateExpr(scope, expr[1]), evaluateExpr(scope, expr[2])])
      .then(results => {
        if (results[0].type === symbols.STRING && results[1].type === symbols.STRING) {
          resolve(readFileSync(path.resolve(findBasepath(scope), results[0].value), results[1].value));
        } else {
          reject(new Error(`Requires filename and encoding to be strings. Got ${results[0]} and ${results[1]}`));
        }
      });
  });

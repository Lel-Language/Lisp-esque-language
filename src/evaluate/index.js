const evaluateExpr = require('./evaluate-expr');
const lelPromise = require('../util/lel-promise');
const lelSeries = require('../util/lel-series');

module.exports = (ast, basepath = __dirname) => {
  const rootScope = require('./create-scope')(null, basepath);
  return lelPromise((resolve, reject) => {
    const astEvaluators = ast.map((expr) => () => evaluateExpr(rootScope, expr));
    lelSeries(astEvaluators).then(resolve);
  });
};

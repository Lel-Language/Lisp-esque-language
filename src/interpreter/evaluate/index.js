const evaluateExpr = require('./evaluate-expr');
const {mapSeries} = require('bluebird');

module.exports = (ast, basepath = __dirname) => {
  const rootScope = require('./create-scope')(null, basepath);
  return new Promise((resolve, reject) => {
    const astEvaluators = ast.map((expr) => () => evaluateExpr(rootScope, expr));
    mapSeries(astEvaluators, (promiseGetter) => promiseGetter())
      .then(resolve).catch(console.error);
  }).catch(console.error);
}
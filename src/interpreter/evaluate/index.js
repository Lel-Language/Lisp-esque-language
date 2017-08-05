const evaluateExpr = require('./evaluate-expr');
const rootScope = require('./create-scope')(null);
const {mapSeries} = require('bluebird');

module.exports = (ast) =>
  new Promise((resolve, reject) => {
    const astEvaluators = ast.map((expr) => () => evaluateExpr(rootScope, expr));
    mapSeries(astEvaluators, (promiseGetter) => promiseGetter())
      .then(resolve).catch(console.error);
  }).catch(console.error);

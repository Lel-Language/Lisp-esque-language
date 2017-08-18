const symbols = require('../../../symbols');
const createToken = require('../../../create-token');
const callFunction = require('./call-function');

const lelPromise = require('../../../util/lel-promise');
const lelSeries = require('../../../util/lel-series');

const getMappingFunction =
  (resolve, reject, evaluateExpr, scope, expr) =>
    (list) => {
      if (list.type !== symbols.LIST) {
        reject(new Error(`Invalid list passed to map. Got ${expr}`));
      }

      evaluateExpr(scope, expr[2]).then(performMapping(resolve, reject, evaluateExpr, scope, expr, list));
    };

const performMapping =
  (resolve, reject, evaluateExpr, scope, expr, list) =>
    (mappingFunction) => {
      if (mappingFunction.type !== symbols.FUNCTION_REFERENCE) {
        reject(new Error(`Invalid function passed to map. Got ${expr}`));
      }

      const mapCalls = list.value.map(
        (listElement, i) =>
          () => callFunction(evaluateExpr, scope, [listElement, createToken(symbols.NUMBER, i)], mappingFunction.value)
      );
      lelSeries(mapCalls).then(values => resolve(createToken(symbols.LIST, values)));
    };

module.exports = (evaluateExpr, scope, expr) =>
  lelPromise((resolve, reject) =>
    evaluateExpr(scope, expr[1]).then(getMappingFunction(resolve, reject, evaluateExpr, scope, expr))
  );

const symbols = require('../../../symbols');
const createToken = require('../../../create-token');
const callFunction = require('./call-function');

const lelPromise = require('../../../util/lel-promise');
const lelSeries = require('../../../util/lel-series');

const getFilteringFunction =
  (resolve, reject, evaluateExpr, scope, expr) =>
    (list) => {
      if (list.type !== symbols.LIST) {
        reject(new Error(`Invalid list passed to filter. Got ${expr}`));
      }

      evaluateExpr(scope, expr[2])
        .then(performFiltering(resolve, reject, evaluateExpr, scope, expr, list));
    };

const performFiltering =
  (resolve, reject, evaluateExpr, scope, expr, list) =>
    (filteringFunction) => {
      if (filteringFunction.type !== symbols.FUNCTION_REFERENCE) {
        reject(new Error(`Invalid function passed to filter. Got ${expr}`));
      }

      const mapCalls = list.value.map(
        (listElement, i) =>
          () => callFunction(evaluateExpr, scope, [listElement, createToken(symbols.NUMBER, i)], filteringFunction.value)
      );
      lelSeries(mapCalls)
        .then(values => {
          const newList = list.value.filter((element, index) => values[index].value);
          resolve(createToken(symbols.LIST, newList))
        });
    };

module.exports = (evaluateExpr, scope, expr) =>
  lelPromise((resolve, reject) =>
    evaluateExpr(scope, expr[1])
      .then(getFilteringFunction(resolve, reject, evaluateExpr, scope, expr))
  );

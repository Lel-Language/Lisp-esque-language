const symbols = require('../../../../symbols');
const createToken = require('../../../../create-token');
const callFunction = require('./call-function');

const {mapSeries} = require('bluebird');

const getMappingFunction =
  (resolve, reject, evaluateExpr, scope, expr) =>
    (list) => {
      if (list.type !== symbols.LIST) {
        throw new Error(`Invalid list passed to map. Got ${expr}`);
      }

      evaluateExpr(scope, expr[2])
        .catch(console.error)
        .then(performMapping(resolve, reject, evaluateExpr, scope, expr, list));
    };

const performMapping =
  (resolve, reject, evaluateExpr, scope, expr, list) =>
    (mappingFunction) => {
      if (mappingFunction.type !== symbols.FUNCTION_REFERENCE) {
        throw new Error(`Invalid function passed to map. Got ${expr}`);
      }

      const mapPromises = list.value.map(
        (listElement, i) =>
          () => callFunction(evaluateExpr, scope, [listElement, createToken(symbols.NUMBER, i)], mappingFunction.value)
      );
      mapSeries(mapPromises, (promiseGetter) => promiseGetter())
        .then(values => resolve(createToken(symbols.LIST, values)));
    }

module.exports = (evaluateExpr, scope, expr) =>
  new Promise((resolve, reject) => {
    evaluateExpr(scope, expr[1])
      .catch(console.error)
      .then(getMappingFunction(resolve, reject, evaluateExpr, scope, expr));
  }).catch(console.error);
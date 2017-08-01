const symbols = require('../../../../symbols');
const createToken = require('../../../../create-token');
const callFunction = require('./call-function');
// (map list function)

module.exports = (evaluateExpr, scope, expr) => {

  const list = evaluateExpr(scope, expr[1]);
  if (list.type !== symbols.LIST) {
    throw new Error(`Invalid list passed to map. Got ${expr}`);
  }

  const mappingFunction = evaluateExpr(scope, expr[2]);
  if (mappingFunction.type !== symbols.FUNCTION_REFERENCE) {
    throw new Error(`Invalid function passed to map. Got ${expr}`);
  }

  const newList = list.value.map(
    (listElement, i) => callFunction(evaluateExpr, scope, [listElement, i], mappingFunction.value)
  );

  return createToken(symbols.LIST, newList);
};
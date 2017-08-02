const symbols = require('../../../../symbols');
const createLambda = require('./lambda');
const callFunction = require('./call-function');

module.exports = (evaluateExpr, scope, expr) => {
  const fRefIsArray = Array.isArray(expr[1]);
  const fRefIsIndentifier = expr[1].isToken && expr[1].type === symbols.IDENTIFIER;

  let fReference;
  if (expr[1] && (fRefIsArray || fRefIsIndentifier)) {
    fReference = evaluateExpr(scope, expr[1]);
  } else {
    throw new Error(`${expr[1]} is not a valid function reference`);
  }

  if (fReference && fReference.isToken && fReference.type === symbols.FUNCTION_REFERENCE) {
    const functionDescriptor = fReference.value;
    if (expr[2]) {
      const args = expr.slice(2).map(subExpr => evaluateExpr(scope, subExpr));
      return callFunction(evaluateExpr, scope, args, functionDescriptor);
    } else {
      throw new Error(`Argument list cannot be undefined for call (${functionDescriptor.name}). Expression ${expr}`);
    }
  } else {
    throw new Error(`First argument must be a FUNCTION_REFERENCE. Got ${expr[1].type} for expression ${expr}`);
  }
}
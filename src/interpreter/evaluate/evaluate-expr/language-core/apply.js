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
      const args = evaluateExpr(scope, expr[2]);
      if (args.type !== symbols.LIST) {
        throw new Error(`Referenced arguments must be a LIST apply (${functionDescriptor.name}). Got ${args.type} for expression ${expr}`);
      }
      return callFunction(evaluateExpr, scope, args.value, functionDescriptor);
    } else {
      throw new Error(`Argument LIST cannot be undefined for apply (${functionDescriptor.name}). Expression ${expr}`);
    }
  } else {
    throw new Error(`First argument must be a FUNCTION_REFERENCE. Got ${expr[1].type} for expression ${expr}`);
  }
}
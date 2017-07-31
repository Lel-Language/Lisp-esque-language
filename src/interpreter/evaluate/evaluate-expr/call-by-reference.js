const symbols = require('../../../symbols');

module.exports = (evaluateExpr, callFunction, scope, expr) => {
  let fReference;
  if (expr[1] && expr[1].isToken && expr[1].type === symbols.IDENTIFIER) {
    fReference = evaluateExpr(scope, expr[1]);
  } else {
    throw new Error(`${expr[1]} is not a valid function reference`);
  }

  if (fReference && fReference.isToken && fReference.type === symbols.FUNCTION_REFERENCE) {
    const functionDescriptor = fReference.value;
    if (expr[2]) {
      // Work out if arguments is a list reference or an explicit expression
      let args;
      if (expr[2].isToken && expr[2].type === symbols.IDENTIFIER) {
        const listReference = evaluateExpr(scope, expr[2]);
        if (listReference && listReference.isToken && listReference.type === symbols.LIST) {
          args = listReference.value;
        } else {
          throw new Error(`Call arguments must be a LIST. Got ${listReference}`);
        }
      } else {
        // Provide arguments as an evaluated list
        args = expr.slice(2).map(subExpr => evaluateExpr(scope, subExpr));
      }

      return callFunction(scope, args, functionDescriptor);
    } else {
      throw new Error(`Argument list cannot be undefined for call (${functionDescriptor.name}). Expression ${expr}`);
    }
  } else {
    throw new Error(`First argument must be a FUNCTION_REFERENCE. Got ${expr[1].type} for expression ${expr}`);
  }
}
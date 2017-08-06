const symbols = require('../../../../symbols');
const createLambda = require('./lambda');
const callFunction = require('./call-function');
const lelPromise = require('../../../../util/lel-promise');

const getFunctionArguments = (resolve, reject, evaluateExpr, scope, expr) =>
  (fReference) => {
    if (fReference && fReference.isToken && fReference.type === symbols.FUNCTION_REFERENCE) {
      const functionDescriptor = fReference.value;
      if (expr[2]) {
        Promise
          .all(expr.slice(2).map(subExpr => evaluateExpr(scope, subExpr)))
          .catch(console.error)
          .then(performFunctionCall(resolve, reject, evaluateExpr, scope, expr, functionDescriptor));
      } else {
        performFunctionCall(resolve, reject, evaluateExpr, scope, expr, functionDescriptor)([]);
      }
    } else {
      reject(new Error(`First argument must be a FUNCTION_REFERENCE. Got ${expr[1].type} for expression ${expr}`));
    }
  };

const performFunctionCall = (resolve, reject, evaluateExpr, scope, expr, functionDescriptor) =>
  (args) =>
    callFunction(evaluateExpr, scope, args, functionDescriptor).then(resolve);

module.exports = (evaluateExpr, scope, expr) => 
  lelPromise((resolve, reject) => {
    const fRefIsArray = Array.isArray(expr[1]);
    const fRefIsIndentifier = expr[1].isToken && expr[1].type === symbols.IDENTIFIER;

    let fReference;
    if (expr[1] && (fRefIsArray || fRefIsIndentifier)) {
      evaluateExpr(scope, expr[1])
        .then(getFunctionArguments(resolve, reject, evaluateExpr, scope, expr));
    } else {
      reject(new Error(`${expr[1]} is not a valid function reference`));
    }
  });
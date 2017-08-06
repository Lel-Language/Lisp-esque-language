const symbols = require('../../../../symbols');
const createLambda = require('./lambda');
const callFunction = require('./call-function');
const createToken = require('../../../../create-token');

const lelPromise = require('../../../../util/lel-promise');

const performFunctionCall = (resolve, reject, evaluateExpr, scope, expr, functionDescriptor) =>
  (args) => {
    if (args.type !== symbols.LIST) {
      reject(new Error(`Referenced arguments must be a LIST apply (${functionDescriptor.name}). Got ${args.type} for expression ${expr}`));
    }
    callFunction(evaluateExpr, scope, args.value, functionDescriptor).then(resolve);
  };

const getFunctionArgs = (resolve, reject, evaluateExpr, scope, expr) =>
  (fReference) => {
    if (fReference && fReference.isToken && fReference.type === symbols.FUNCTION_REFERENCE) {
      const functionDescriptor = fReference.value;
      if (expr[2]) {
        evaluateExpr(scope, expr[2])
          .then(performFunctionCall(resolve, reject, evaluateExpr, scope, expr, functionDescriptor));
      } else {
        const emptyList = createToken(symbols.LIST, []);
        performFunctionCall(resolve, reject, evaluateExpr, scope, expr, functionDescriptor)(emptyList);
      }
    } else {
      reject(new Error(`First argument must be a FUNCTION_REFERENCE. Got ${expr[1].type} for expression ${expr}`));
    }
  };

module.exports = (evaluateExpr, scope, expr) =>
  lelPromise((resolve, reject) => {
    const fRefIsArray = Array.isArray(expr[1]);
    const fRefIsIndentifier = expr[1].isToken && expr[1].type === symbols.IDENTIFIER;

    let fReference;
    if (expr[1] && (fRefIsArray || fRefIsIndentifier)) {
      evaluateExpr(scope, expr[1])
        .then(getFunctionArgs(resolve, reject, evaluateExpr, scope, expr));
    } else {
      reject(new Error(`${expr[1]} is not a valid function reference`));
    }
  })
const symbols = require('../../../../symbols');
const scopedFunction = require('./create-function/scoped-function');
const createScope = require('../../create-scope');
const createToken = require('../../../../create-token');

const lelPromise = require('../../../../util/lel-promise');
const lelSeries = require('../../../../util/lel-series');

module.exports = (evaluateExpr, scope, expr) =>
  lelPromise((resolve, reject) => {
    const fName = 'lambda_function';
    const expectedArguments = expr[1]
      .map(token => {
        if (token.type !== symbols.IDENTIFIER) {
          reject(new Error(`Function declaration arguments must be an IDENTIFER. Got ${token.type} for function ${fName}`));
        }
        return token.value;
      });

    const fBody = expr.slice(2);
    if (fBody.length < 1) {
      reject(new Error(`Function body must contain at least one statement. Got none for function ${fName}`));
    }

    const functionScope = createScope(scope);
    resolve(createToken(symbols.FUNCTION_REFERENCE, scopedFunction(fName, fBody, expectedArguments, functionScope)));
  });

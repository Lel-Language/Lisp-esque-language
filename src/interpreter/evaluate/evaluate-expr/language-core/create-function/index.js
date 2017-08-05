const symbols = require('../../../../../symbols');
const scopedFunction = require('./scoped-function');
const createScope = require('../../../create-scope');
const createToken = require('../../../../../create-token');

module.exports = (evaluateExpr, scope, expr) =>
  new Promise((resolve, reject) => {
    if (expr[1].type !== symbols.IDENTIFIER) {
      throw new Error(`Function name must be an IDENTIFER. Got ${expr[1].type} for ${expr[1].value}`);
    }
    const fName = expr[1].value;
    const expectedArguments = expr[2]
      .map(token => {
        if (token.type !== symbols.IDENTIFIER) {
          throw new Error(`Function declaration arguments must be an IDENTIFER. Got ${token.type} for function ${fName}`);
        }
        return token.value;
      });

    const fBody = expr.slice(3);
    if (fBody.length < 1) {
      throw new Error(`Function body must contain at least one statement. Got none for function ${fName}`);
    }

    const functionScope = createScope(scope);
    scope.variables[fName] = createToken(symbols.FUNCTION_REFERENCE, scopedFunction(fName, fBody, expectedArguments, functionScope));
    resolve(scope.variables[fName]);
  }).catch(console.error);

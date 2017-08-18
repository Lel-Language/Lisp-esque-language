const symbols = require('../../symbols');
const createToken = require('../../create-token');
const core = require('./language-core');
const callFunction = require('./language-core/call-function');
const standard = require('./language-core/standard-language-functions');
const findInScope = require('./find-in-scope');

const lelPromise = require('../../util/lel-promise');
const lelPromiseAll = require('../../util/lel-promise-all');
const lelSeries = require('../../util/lel-series');

const evaluateExpr = (scope, expr) =>
  lelPromise((resolve, reject) => {
    // Return the value of primitives directly in their tokenised form
    if (expr.isToken &&
      (expr.type === symbols.RANGE
        || expr.type === symbols.STRING
        || expr.type === symbols.NUMBER
        || expr.type === symbols.BOOLEAN
        || expr.type === symbols.FUNCTION_REFERENCE
        || expr.type === symbols.LIST)) resolve(expr);

    // Identifiers will be a function reference or a variable
    if (expr.type === symbols.IDENTIFIER) {
      const identifierType = expr.value;

      // Pass back variable value. Explicitly check null instead of other
      // falsey values that might really be contained in the variable
      const variableInScope = findInScope(scope, identifierType);
      if (variableInScope !== null) resolve(variableInScope);
    }

    // Evaluate empty block
    if (Array.isArray(expr) && expr.length === 0) resolve(createToken(symbols.LIST, []));

    // List of expressions?
    if (Array.isArray(expr)) {
      // Evaluate a block in series
      if (Array.isArray(expr[0])) {
        const blockEvaluators = expr.map(blockExpr => () => evaluateExpr(scope, blockExpr));
        return lelSeries(blockEvaluators).then(values => resolve(values[values.length-1]));
      }

      // The rest of the expressions are based on identifiers
      const identifierToken = expr[0];
      if (identifierToken.type !== symbols.IDENTIFIER) {
        return reject(new Error(`Expected IDENTIFIER symbol, got ${indentifierToken.type}\nExpr: ${JSON.stringify(expr)}`));
      }

      // Core language functions
      if (identifierToken.value in core) {
        return core[identifierToken.value](evaluateExpr, scope, expr).then(resolve);
      }

      // Standard languages functions that manipulate primitives
      if (identifierToken.value in standard) {
        return lelPromiseAll(expr.slice(1).map(subExpr => evaluateExpr(scope, subExpr)))
          .then(args =>
            standard[identifierToken.value](...args)
              .then(resolve)
          );
      }

      // Run a scoped function if one is found
      const scopedFunction = findInScope(scope, identifierToken.value);
      if (scopedFunction && scopedFunction.type === symbols.FUNCTION_REFERENCE) {
        return lelPromiseAll(expr.slice(1).map(subExpr => evaluateExpr(scope, subExpr)))
          .then(args =>
            callFunction(evaluateExpr, scope, args, scopedFunction.value)
              .then(resolve)
          );
      }

      // Try and evaluate as a single expression
      return evaluateExpr(scope, expr[0]).then(resolve);
    }

    return reject(new Error(`Unrecognised expression: ${JSON.stringify(expr)}`));
  });

module.exports = evaluateExpr;

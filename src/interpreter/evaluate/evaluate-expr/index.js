const symbols = require('../../../symbols');
const createToken = require('../../../create-token');
const core = require('./language-core');
const findInScope = require('./find-in-scope');
const {mapSeries} = require('bluebird');

const evaluateExpr = (scope, expr) =>
  new Promise((resolve) => {
    // Return the value of primitives directly in their tokenised form
    if (expr.type === symbols.STRING
        || expr.type === symbols.NUMBER
        || expr.type === symbols.BOOLEAN
        || expr.type === symbols.FUNCTION_REFERENCE
        || expr.type === symbols.LIST) resolve(expr);

    // Identifiers will be a function reference or a variable
    if (expr.type === symbols.IDENTIFIER) {
      const identifierType = expr.value;

      // Pass back variable value. Explicitly check null instead of other
      // falsey values that might really be contained in the variable
      const variableInScope = findInScope(scope, identifierType);
      if (variableInScope !== null) resolve(variableInScope);
    }

    // Evaluate empty block
    if (Array.isArray(expr) && expr.length == 0) resolve(createToken(symbols.LIST, []));

    // List of expressions?
    if (Array.isArray(expr)) {
      // Evaluate a block in series
      if (Array.isArray(expr[0])) {
        const blockEvaluators = expr.map(blockExpr => () => evaluateExpr(scope, blockExpr));
        return mapSeries(blockEvaluators, (promiseGetter) => promiseGetter())
          .then(values => resolve(values[values.length-1]));
      }

      // The rest of the expressions are based on identifiers
      const indentifierToken = expr[0];
      if (indentifierToken.type !== symbols.IDENTIFIER) {
        throw new Error(`Expected IDENTIFIER symbol, got ${indentifierToken.type}\nExpr: ${JSON.stringify(expr)}`);
      }

      // Declare a function in the current scope
      if (indentifierToken.value === 'function') {
        return core.function(scope, expr)
          .then(resolve);
      }

      if (indentifierToken.value === 'lambda') {
        return core.lambda(scope, expr)
          .then(resolve);
      }

      if (indentifierToken.value === 'map') {
        return core.map(evaluateExpr, scope, expr)
          .then(resolve);
      }

      if (indentifierToken.value === 'let') {
        return core.let(evaluateExpr, scope, expr)
          .then(resolve);
      }

      if (indentifierToken.value === 'mutate') {
        return core.mutate(evaluateExpr, scope, expr)
          .then(resolve);
      }

      if (indentifierToken.value === 'if') {
        return core.if(evaluateExpr, scope, expr)
          .then(resolve);
      }

      if (indentifierToken.value === 'call') {
        return core.call(evaluateExpr, scope, expr)
          .then(resolve);
      }

      if (indentifierToken.value === 'apply') {
        return core.apply(evaluateExpr, scope, expr)
          .then(resolve);
      }

      if (indentifierToken.value === 'list') {
        return core.list(evaluateExpr, scope, expr)
          .then(resolve);
      }

      if (indentifierToken.value in core.standard) {
        return Promise
          .all(expr.slice(1).map(subExpr => evaluateExpr(scope, subExpr).catch(console.error)))
          .then(args => {
            core.standard[indentifierToken.value](...args)
              .then(resolve);
          });
      }

      // Run a scoped function if one is found
      const scopedFunction = findInScope(scope, indentifierToken.value);
      if (scopedFunction && scopedFunction.type === symbols.FUNCTION_REFERENCE) {
        return Promise
          .all(expr.slice(1).map(subExpr => evaluateExpr(scope, subExpr).catch(console.error)))
          .then(args => {
            core
              .callFunction(evaluateExpr, scope, args, scopedFunction.value)
              .then(resolve);
          });
      }

      // Try and evaluate as a single expression
      return evaluateExpr(scope, expr[0]).then(resolve.catch(console.error));
    }

    throw new Error(`Unrecognised expression: ${JSON.stringify(expr)}`);
  });

module.exports = evaluateExpr;
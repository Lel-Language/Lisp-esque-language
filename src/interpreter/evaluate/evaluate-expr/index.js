const symbols = require('../../../symbols');
const createToken = require('../../../create-token');
const core = require('./language-core');
const findInScope = require('./find-in-scope');

const evaluateExpr = (scope, expr) => {
  // List of expressions?
  if (Array.isArray(expr)) {
    // Evaluate empty block
    if (Array.isArray(expr) && expr.length == 0) return;

    // Evaluate a block
    if (Array.isArray(expr[0])) {
      return expr.reduce((acc, subExpr) => evaluateExpr(scope, subExpr), 0);
    }

    // The rest of the expressions are based on identifiers
    const indentifierToken = expr[0];
    if (indentifierToken.type !== symbols.IDENTIFIER) {
      throw new Error(`Expected IDENTIFIER symbol, got ${indentifierToken.type}\nExpr: ${JSON.stringify(expr)}`);
    }

    // Declare a function in the current scope
    if (indentifierToken.value === 'function') return core.function(scope, expr);
    if (indentifierToken.value === 'lambda') return core.lambda(scope, expr);
    if (indentifierToken.value === 'map') return core.map(evaluateExpr, scope, expr);
    if (indentifierToken.value === 'let') return core.let(evaluateExpr, scope, expr);
    if (indentifierToken.value === 'mutate') return core.mutate(evaluateExpr, scope, expr);
    if (indentifierToken.value === 'if') return core.if(evaluateExpr, scope, expr);
    if (indentifierToken.value === 'call') return core.call(evaluateExpr, scope, expr);
    if (indentifierToken.value === 'list') return core.list(evaluateExpr, scope, expr);
    if (indentifierToken.value in core.standard) {
      const args = expr
        .slice(1)
        .map(subExpr => evaluateExpr(scope, subExpr));
      return core.standard[indentifierToken.value](...args);
    }

    // Run a scoped function if one is found
    const scopedFunction = findInScope(scope, indentifierToken.value);
    if (scopedFunction && scopedFunction.type === symbols.FUNCTION_REFERENCE) {
      const args = expr.slice(1).map(subExpr => evaluateExpr(scope, subExpr));
      return core.callFunction(evaluateExpr, scope, args, scopedFunction.value);
    }

    // Try and evaluate as a single expression
    return evaluateExpr(scope, expr[0]);
  }

  // Return the value of primitives directly in their tokenised form
  if (expr.type === symbols.STRING
      || expr.type === symbols.NUMBER
      || expr.type === symbols.BOOLEAN
      || expr.type === symbols.FUNCTION_REFERENCE
      || expr.type === symbols.LIST) return expr;

  // Identifiers will be a function reference or a variable
  if (expr.type === symbols.IDENTIFIER) {
    const identifierType = expr.value;

    // Pass back variable value. Explicitly check null instead of other
    // falsey values that might really be contained in the variable
    const variableInScope = findInScope(scope, identifierType);
    if (variableInScope !== null) return variableInScope;
  }

  throw new Error(`Unrecognised expression: ${JSON.stringify(expr)}`);
};

module.exports = evaluateExpr;
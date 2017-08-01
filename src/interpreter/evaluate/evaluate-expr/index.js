const symbols = require('../../../symbols');
const createToken = require('../../../create-token');
const core = require('./language-core');
const {
  findFunctionInScope,
  findVariableInScope
} = require('./find-in-scope');

const evaluateExpr = (scope, expr) => {
  // List of expressions?
  if (Array.isArray(expr)) return evaluateFunctionExpr(scope, expr);

  if (expr.isToken) {
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
      const variableInScope = findVariableInScope(scope, identifierType);
      if (variableInScope !== null) return variableInScope;

      // Pass back function descriptor
      const functionInScope = findFunctionInScope(scope, identifierType)
      if (functionInScope !== null) return createToken(symbols.FUNCTION_REFERENCE, functionInScope);
    }
  }

  throw new Error(`Unrecognised expression: ${JSON.stringify(expr)}`);
};

const evaluateFunctionExpr = (scope, expr) => {
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
  if (indentifierToken.value === 'function') return core.createFunction(scope, expr);
  if (indentifierToken.value === 'lambda') return core.createLambda(scope, expr);
  if (indentifierToken.value === 'map') return core.mapList(evaluateExpr, scope, expr);
  if (indentifierToken.value === 'let') return core.letAssign(evaluateExpr, scope, expr);
  if (indentifierToken.value === 'if') return core.ifStatement(evaluateExpr, scope, expr);
  if (indentifierToken.value === 'call') return core.callByReference(evaluateExpr, scope, expr);
  if (indentifierToken.value === 'list') return core.createList(evaluateExpr, scope, expr);
  if (indentifierToken.value in core.standard) {
    const args = expr
      .slice(1)
      .map(subExpr => evaluateExpr(scope, subExpr));
    return core.standard[indentifierToken.value](...args);
  }

  // Run a scoped function if one is found
  const scopedFunction = findFunctionInScope(scope, indentifierToken.value);
  if (scopedFunction) {
    const args = expr.slice(1).map(subExpr => evaluateExpr(scope, subExpr));
    return callFunction(evaluateExpr, scope, args, scopedFunction);
  }

  // Try and evaluate as a single expression
  if (Array.isArray(expr)) return evaluateExpr(scope, expr[0]);
  throw new Error(`Unrecognised expression: ${JSON.stringify(expr)}`);
};

module.exports = evaluateExpr;
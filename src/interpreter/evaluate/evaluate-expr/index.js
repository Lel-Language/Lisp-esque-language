const symbols = require('../../../symbols');
const createToken = require('../../../create-token');
const createFunction = require('./create-function');
const createLambda = require('./lambda');
const letAssign = require('./let-assign');
const ifStatement = require('./if-statement');
const callByReference = require('./call-by-reference');
const {
  findFunctionInScope,
  findVariableInScope
} = require('./find-in-scope');
const createScope = require('../create-scope');
const languageFunctions = require('./language-functions');

const callFunction = (scope, args, functionDescriptor) => {
  // Every time the function runs it gets it's own scope, meaning variables set inside this function
  // will not persist across different calls.
  const executionScope = createScope(functionDescriptor.scope);

  if (args.length !== functionDescriptor.expectedArguments.length) {
    throw new Error(`Expected ${functionDescriptor.expectedArguments.length} arguments for function ${functionDescriptor.name} but got ${args.legnth}`);
  }

  args.forEach((argument, i) => {
    if (argument.isFunction) executionScope.functions[functionDescriptor.expectedArguments[i]] = argument;
    else executionScope.variables[functionDescriptor.expectedArguments[i]] = argument;
  });

  const result = functionDescriptor.bodyExpressions.reduce((acc, fExpr, i) => {
    return evaluateExpr(executionScope, fExpr)
  }, 0);
  return result;
}

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
  if (indentifierToken.value === 'function') return createFunction(scope, expr);
  if (indentifierToken.value === 'lambda') return createLambda(scope, expr);

  // Declare a named variable in the current scope
  if (indentifierToken.value === 'let') return letAssign(evaluateExpr, scope, expr);

  // Conditional
  if (indentifierToken.value === 'if') return ifStatement(evaluateExpr, scope, expr);

  // Call evaluates a function by reference
  if (indentifierToken.value === 'call') return callByReference(evaluateExpr, callFunction, scope, expr);

  // List evaluation
  if (indentifierToken.value === 'list') {
    const evaluatedList = expr.slice(1).map(subExpr => evaluateExpr(scope, subExpr))
    return createToken(symbols.LIST, evaluatedList);
  }

  // Run a standard language function
  if (indentifierToken.value in languageFunctions) {
    const args = expr
      .slice(1)
      .map(subExpr => evaluateExpr(scope, subExpr));
    return languageFunctions[indentifierToken.value](scope, ...args);
  }

  // Run a scoped function if one is found
  const scopedFunction = findFunctionInScope(scope, indentifierToken.value);
  if (scopedFunction) {
    const args = expr.slice(1).map(subExpr => evaluateExpr(scope, subExpr));
    return callFunction(scope, args, scopedFunction);
  }

  // Try and evaluate as a single expression
  if (Array.isArray(expr)) return evaluateExpr(scope, expr[0]);
  throw new Error(`Unrecognised expression: ${JSON.stringify(expr)}`);
};

module.exports = evaluateExpr;
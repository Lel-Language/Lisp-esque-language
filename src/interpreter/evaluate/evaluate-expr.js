const symbols = require('../../symbols');
const createFunction = require('./create-function');
const {
  findFunctionInScope,
  findVariableInScope
} = require('./find-in-scope');
const languageFunctions = require('./language-functions');

const evaluateExpr = (scope, expr) => {
  // List of expressions?
  if (Array.isArray(expr)) {
    return evaluateFunctionExpr(scope, expr);;
  } else if (expr.isToken) {
    // Return the value of primitives directly
    if (expr.type === symbols.STRING || expr.type === symbols.NUMBER || expr.type === symbols.BOOLEAN) return expr.value;

    // Identifiers will be a function reference or a variable
    if (expr.type === symbols.IDENTIFIER) {
      const identifierType = expr.value;

      // Pass back function descriptor
      if (identifierType in scope.functions) return scope.functions[identifierType];

      // Pass back variable value
      if (identifierType in scope.variables) return scope.variables[identifierType];
      // Search upper scope
    }
  }
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
  if (indentifierToken.value === 'function') {
    return createFunction(scope, expr);
  }

  // Declare a named variable in the current scope
  if (indentifierToken.value === 'let') {
    // return createVariable(scope, expr);
    if (expr[1].type !== symbols.IDENTIFIER) {
      throw new Error(`Variable name must be an IDENTIFER. Got ${expr[1].type} for ${expr[1].value}`);
    }
    const name = expr[1].value;
    const value = evaluateExpr(scope, expr[2]);

    if (name in scope.variables) {
      throw new Error(`Can't mutate previously assigned scoped variable '${name}'`);
    }
    if (name in scope.functions) {
      throw new Error(`Can't mutate scoped function '${name}' with variable declaration.`);
    }
    scope.variables[name] = value;
    return value;
  }

  // Conditional call
  if (indentifierToken.value === 'if') {
    if (expr.length < 4) {
      throw new Error(`Conditional expressions require 3 arguments. Got ${expr.length} at expression ${JSON.stringify(expr)}`);
    }
    const conditionResult = evaluateExpr(scope, expr[1]);
    if (conditionResult) return evaluateExpr(scope, expr[2]);
    return evaluateExpr(scope, expr[3]);
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
    const args = expr
      .slice(1)
      .map(subExpr => evaluateExpr(scope, subExpr));

    if (args.length !== scopedFunction.expectedArguments.length) {
      throw new Error(`Expected ${scopedFunction.expectedArguments.length} arguments for function ${indentifierToken.value} but got ${args.legnth}`);
    }

    args.forEach((argument, i) => {
      if (argument.isFunction) scopedFunction.scope.functions[scopedFunction.expectedArguments[i]] = argument;
      else scopedFunction.scope.variables[scopedFunction.expectedArguments[i]] = argument;
    });

    const result = scopedFunction.bodyExpressions.reduce((acc, fExpr, i) => {
      return evaluateExpr(scopedFunction.scope, fExpr)
    }, 0);
    return result;
  }

  // Try and evaluate as a single expression
  if (Array.isArray(expr)) return evaluateExpr(scope, expr[0]);

  throw new Error(`Unrecognised expression: ${JSON.stringify(expr)}`);
};

module.exports = evaluateExpr;
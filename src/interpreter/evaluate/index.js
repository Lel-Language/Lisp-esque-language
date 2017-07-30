const symbols = require('../../symbols');

const createScope = require('./create-scope');
const languageFunctions = require('./language-functions');
const rootScope = createScope(null);
const stack = [rootScope];

const getScope = () => stack[stack.length - 1];
const evaluateExpr = (expr) => {
  // List of expressions?
  if (Array.isArray(expr)) {
    return evaluateFunctionExpr(expr);;
  } else if (expr.isToken) {
    // Return the value of primitives directly
    if (expr.type === symbols.STRING || expr.type === symbols.NUMBER) return expr.value;

    // Identifiers will be a function reference or a variable
    if (expr.type === symbols.IDENTIFIER) {
      const identifierType = expr.value;
      const scope = getScope();

      // Evaluate to a value directly
      if (identifierType in scope.functions) return scope.functions[identifierType];
      if (identifierType in scope.variables) return scope.variables[identifierType];
      // Search upper scope
    }
  }
}

const evaluateFunctionExpr = (expr) => {
  const scope = getScope();
  const indentifierToken = expr[0];

  if (indentifierToken.type !== symbols.IDENTIFIER) {
    throw new Error(`Error. Expected IDENTIFIER symbol, got ${indentifierToken.type}\nExpr: ${expr}`);
  }

  if (indentifierToken.value in languageFunctions) {
    // It's a language level function
    const args = expr
      .slice(1)
      .map(evaluateExpr);

    return languageFunctions[indentifierToken.value](scope, ...args);
  } else if (indentifierToken.value in scope.functions) {
    // It's a scope level function
    
    // Push scope
    // Evaluate
    // Pop scope
    // Return

    //scope.functions[indentifierToken.value]
  } else {
    // Recurse through upperScope
  }
};

module.exports = (ast) => {
  // Scope rules
  // Language scope -> scope -> upperScope (ascend)
  // console.log(ast)
  ast.forEach(evaluateFunctionExpr);
};

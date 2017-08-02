const createScope = require('../../create-scope');

module.exports = (evaluateExpr, scope, args, functionDescriptor) => {
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
};

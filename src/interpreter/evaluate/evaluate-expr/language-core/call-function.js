const createScope = require('../../create-scope');

module.exports = (evaluateExpr, scope, args, functionDescriptor) => {
  // Every time the function runs it gets it's own scope, meaning variables set inside this function
  // will not persist across different calls.
  const executionScope = createScope(functionDescriptor.scope);

  if (args.length !== functionDescriptor.expectedArguments.length) {
    throw new Error(`Expected ${functionDescriptor.expectedArguments.length} arguments for function ${functionDescriptor.name} but got ${args.legnth}`);
  }

  // Place arguments into the execution scope
  args.forEach((argument, i) =>
    executionScope.variables[functionDescriptor.expectedArguments[i]] = argument
  );

  return functionDescriptor.bodyExpressions.reduce((acc, fExpr, i) => evaluateExpr(executionScope, fExpr), 0);
};

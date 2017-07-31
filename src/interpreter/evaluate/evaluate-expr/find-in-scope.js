const findFunctionInScope = (scope, functionName) => {
  if (!scope) return null;
  if (functionName in scope.functions) return scope.functions[functionName];
  return findFunctionInScope(scope.upperScope, functionName);
};

const findVariableInScope = (scope, variableName) => {
  if (!scope) return null;
  if (variableName in scope.variables) return scope.variables[variableName];
  return findVariableInScope(scope.upperScope, variableName);
};

module.exports = {
  findFunctionInScope,
  findVariableInScope
};
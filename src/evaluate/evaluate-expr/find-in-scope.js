const findInScope = (scope, name) => {
  if (!scope) return null;
  if (name in scope.variables) return scope.variables[name];
  return findInScope(scope.upperScope, name);
};

module.exports = findInScope;
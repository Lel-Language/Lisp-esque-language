module.exports = (scope) => {
  if (scope.upperScope) return findBasepath(scope.upperScope);
  return scope.basepath;
};
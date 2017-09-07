const findBasepath = (scope) => {
  if (scope.upperScope) return findBasepath(scope.upperScope);
  return scope.basepath;
}

module.exports = findBasePath;

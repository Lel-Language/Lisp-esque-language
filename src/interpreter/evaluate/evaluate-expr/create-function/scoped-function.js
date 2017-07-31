module.exports = (name, bodyExpressions = [], expectedArguments = [], scope = {}) => ({
  name,
  isFunction: true,
  bodyExpressions,
  expectedArguments,
  scope
});
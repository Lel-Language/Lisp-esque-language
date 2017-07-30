module.exports = (bodyExpressions = [], expectedArguments = [], scope = {}) => ({
  isFunction: true,
  bodyExpressions,
  expectedArguments,
  scope
});
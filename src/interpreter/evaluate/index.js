const evaluateExpr = require('./evaluate-expr');
const rootScope = require('./create-scope')(null);

module.exports = (ast) => {
  // console.log(ast)
  ast.forEach(expr =>
    evaluateExpr(rootScope, expr)
  );
}

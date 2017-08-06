const tokenise = require('../tokenise');
const parse = require('../parse');
const createScope = require('../interpreter/evaluate/create-scope');
const evaluateExpr = require('../interpreter/evaluate/evaluate-expr');
const {print} = require('../interpreter/evaluate/evaluate-expr/language-core/standard-language-functions');

module.exports = () => {
  const rootScope = createScope(null, __dirname);
  return (exprStr) => {
    Promise
      .resolve(exprStr)
      .then(tokenise)
      .then(parse)
      .then(ast => {
        evaluateExpr(rootScope, ast[0])
          .then(result => {
            console.log();
            print(result).then(r => {
              process.stdout.write('\n> ');
            })
          });
      })
      .catch(console.error)
  }
}
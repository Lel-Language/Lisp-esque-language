const symbols = require('./symbols');

let depthPointer = 0;
const addTokenToExprTree = (ast, token) => {
  let level = ast;
  for (let i = 0; i < depthPointer; i++) {
    //set the level to the rightmost deepest branch
    level = level[level.length - 1];
  }
  level.push(token);
}

const popExpr = () => depthPointer--;
const pushExpr = (ast) => {
  addTokenToExprTree(ast, []);
  depthPointer++;
};

const getTokenType = (token) => token[0];

module.exports = (tokens) =>
  tokens.reduce((ast, token) => {
    const tokenType = getTokenType(token);

    if (tokenType === symbols.LPAREN) {
      pushExpr(ast);
    } else if (tokenType === symbols.RPAREN) {
      popExpr();
    } else {
      addTokenToExprTree(ast, token);
    }
    return ast;
  }, []);

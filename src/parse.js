const symbols = require('./symbols');
const cleanString = require('./util/clean-string');
const cleanNumber = require('./util/clean-number');
const cleanBool = require('./util/clean-bool');

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

module.exports = (tokens) =>
  tokens.reduce((ast, token) => {
    if (token.type === symbols.STRING) {
      token.value = cleanString(token.value);
    } else if (token.type === symbols.NUMBER) {
      token.value = cleanNumber(token.value);
    } else if (token.type === symbols.BOOLEAN) {
      token.value = cleanBool(token.value);
    }

    if (token.type === symbols.LPAREN) {
      pushExpr(ast);
    } else if (token.type === symbols.RPAREN) {
      popExpr();
    } else {
      addTokenToExprTree(ast, token);
    }
    return ast;
  }, []);

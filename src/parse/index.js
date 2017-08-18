const symbols = require('../symbols');
const createToken = require('../create-token');
const cleanToken = require('./clean');

let depthPointer = 0;
const addTokenToExprTree = (ast, token) => {
  let level = ast;
  for (let i = 0; i < depthPointer; i++) {
    //set the level to the rightmost deepest branch
    level = level[level.length - 1];
  }
  level.push(token);
};

const popExpr = () => depthPointer--;
const pushExpr = (ast) => {
  addTokenToExprTree(ast, []);
  depthPointer++;
};

module.exports = (_tokens) => {
  // Reset depth pointer
  depthPointer = 0;
  const tokens = _tokens
    .map(t => Object.assign({}, t))
    .map(cleanToken);
  let ast = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === symbols.LPAREN) {
      pushExpr(ast);
      continue;
    } else if (token.type === symbols.RPAREN) {
      popExpr();
      continue;
    }

    addTokenToExprTree(ast, token);
  }
  return ast;
};

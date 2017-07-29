const tokeniser = require('./tokeniser');
const parser = require('./parser');

const ins = `
(plus 1
    (minus 200
      (divide 300 2)))

(function-name "do some stuff man")
`;

const tokens = tokeniser(ins);
const ast = parser(tokens);

console.log(ast);
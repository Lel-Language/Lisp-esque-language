const tokenRegexes = require('./tokens');
const tokeniser = require('./tokeniser');

const ins = `
(plus 1
    (minus 200
      (divide 300 2)))
`;

console.log(tokenise(ins, tokenRegexes));
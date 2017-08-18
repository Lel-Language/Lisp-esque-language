const repl = require('./repl')();
const parenthesesBalance = require('./parentheses-balance');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

module.exports = () => {
  process.stdout.write('Lel REPL - Francis Stokes 2017\n> ');
  let expr = '';

  rl.on('line', (input) => {
    expr += input;
    const balance = parenthesesBalance(expr);
    if (expr !== '') {
      if (balance === 0) {
        repl(expr);
        expr = '';
      } else if (balance === -1) {
        // Not enough closing parens, wait for the expression to be completed
        process.stdout.write('> ');
        expr += ' ';
      } else {
        console.error(`Too many ')'!`);
        expr = '';
        process.stdout.write('> ');
      }
    } else {
      process.stdout.write('> ');
    }
  });
};

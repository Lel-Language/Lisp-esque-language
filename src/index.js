#! /usr/bin/env node

const argv = process.argv;
const repl = require('./repl');
const interpreter = require('./interpreter');

if (argv.length < 3) {
  repl();
} else {
  interpreter(argv[2]).then(() => process.exit(0));
}
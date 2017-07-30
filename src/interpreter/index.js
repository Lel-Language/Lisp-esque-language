const argv = process.argv;

if (argv.length < 3) {
  process.stdout.write('Usage: node lel <infile.lel>\n');
  process.exit(1);
}

const readLelFile = require('./read-lel');
const validate = require('./validate');
const tokenise = require('../tokenise');
const parse = require('../parse');
const evaluate = require('./evaluate');

readLelFile(argv[2])
  .then(tokenise, console.error)
  .then(validate, (err) => {
    console.error(err.message);
    process.exit(1);
  })
  .then(parse, console.error)
  .then(evaluate, console.error);

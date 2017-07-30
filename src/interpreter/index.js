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
  .then(tokenise)
  .then(validate)
  .then(parse)
  .then(evaluate)
  .catch(err => {
    console.error(err);
    process.exit(1);
  })

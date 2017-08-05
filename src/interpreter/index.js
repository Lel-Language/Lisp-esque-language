const interpreter = require('./interpreter');
const argv = process.argv;

if (argv.length < 3) {
  process.stdout.write('Usage: node lel <infile.lel>\n');
  process.exit(1);
}
// Run an interpreter instance
interpreter(argv[2]);
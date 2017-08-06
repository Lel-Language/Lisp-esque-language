const path = require('path');

const validate = require('./validate');
const tokenise = require('../tokenise');
const parse = require('../parse');
const evaluate = require('./evaluate');
const readLelFile = require('./read-lel');

module.exports =
  (filename) =>
    readLelFile(filename)
      .then(tokenise)
      .then(validate)
      .then(parse)
      .then(ast => {
        const basepath = path.parse(path.resolve(filename)).dir;
        return evaluate(ast, basepath);
      })
      .catch(err => {
        console.error(err);
        process.exit(1);
      });
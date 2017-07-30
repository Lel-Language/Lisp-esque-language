const {promisify} = require('util');
const readFileAsync = promisify(require('fs').readFile);

module.exports = (filename) =>
  readFileAsync(filename, 'utf8')
    .catch(console.error);
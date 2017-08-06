const path = require('path');
const symbols = require('../../../../symbols');
const createScope = require('../../create-scope');
const findBasepath = require('../find-basepath');

const validate = require('../../../validate');
const tokenise = require('../../../../tokenise');
const parse = require('../../../../parse');
const readLelFile = require('../../../read-lel');

const lelPromise = require('../../../../util/lel-promise');

// Can't import interpreter from here due to circular depenencies, so just put one together from
// the modules. Have to use evaluateExpr directly, and build a scope for it to execute in.
const interpreter = (filename) =>
  readLelFile(filename)
    .then(tokenise)
    .then(validate)
    .then(parse)
    .catch(err => {
      console.error(err);
      process.exit(1);
    });


module.exports = (evaluateExpr, scope, expr) =>
  lelPromise((resolve, reject) => {
    // Evaluate the filename
    evaluateExpr(scope, expr[1])
      .then(filename => {
        if (filename.type === symbols.STRING) {
          const filepath = path.join(findBasepath(scope), filename.value);
          const basepath = path.parse(path.resolve(filepath)).dir;
          interpreter(filepath)
            .then(ast => {
              const moduleScope = createScope(null, basepath);
              evaluateExpr(moduleScope, ast)
                .then(resolve);
            })
            .catch(console.error);
        } else {
          reject(new Error(`Import path must resolve to a string. Got ${filename}`));
        }
      });
  });
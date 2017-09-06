const extensions = require('../../../extensions');
const lelPromise = require('../../../util/lel-promise');

const useFunction = (libName) => {
  try {
    const lib = require(`./stdlib/${libName}.js`);
    Object.keys(lib)
      .forEach(exportedFunction => runtime[exportedFunction] = lib[exportedFunction]);
  } catch (err) {
    if (err.code == 'MODULE_NOT_FOUND') {
      throw new Error(`No standard library '${libName} in Lel.`);
      return;
    }
    throw new Error(`Error: ${err.message}`);
  }
};

const getFunction = (keyword) => runtime[keyword];

const runtime = Object.assign(
  {
    if: require('./if'),
    let: require('./let'),
    function: require('./function'),
    lambda: require('./lambda'),
    list: require('./list'),
    map: require('./map'),
    filter: require('./filter'),
    call: require('./call'),
    apply: require('./apply'),
    mutate: require('./mutate'),
    import: require('./import'),
    use: require('./use')(useFunction)
  },
  // Extensions can override standard language functionality
  extensions
);

module.exports = {
  get: getFunction,
  use: useFunction
};

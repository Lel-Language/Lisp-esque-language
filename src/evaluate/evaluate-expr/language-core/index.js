const extensions = require('../../../extensions');

module.exports = Object.assign(
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
    import: require('./import')
  },
  // Extensions can override standard language functionality
  extensions
);
const {mapSeries} = require('bluebird');

module.exports = (promiseFunctions) =>
  mapSeries(promiseFunctions, (promiseGetter) => promiseGetter())
    .catch(console.error);
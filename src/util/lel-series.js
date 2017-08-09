const {mapSeries} = require('bluebird');
const defaultErr = (err) => console.error(err.message);

module.exports = (promiseFunctions, catchAllFunc = defaultErr) =>
  mapSeries(promiseFunctions, (promiseGetter) => promiseGetter())
    .catch(catchAllFunc);
const defaultErr = (err) => console.error(err.message);

module.exports = (err, catchAllFunc = defaultErr) =>
  Promise.reject(err).catch(catchAllFunc);
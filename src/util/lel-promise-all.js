const defaultErr = (err) => console.error(err.message);

module.exports = (promiseFuncs, catchAllFunc = defaultErr) => {
  const p = Promise.all(promiseFuncs).catch(catchAllFunc);
  return {
    then: (func) => p.then(func).catch(catchAllFunc),
    finally: (func) => p.finally(func).catch(catchAllFunc)
  };
};

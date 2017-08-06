module.exports = (promiseFunc) =>
  new Promise(promiseFunc).catch(console.error);
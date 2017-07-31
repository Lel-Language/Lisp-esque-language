module.exports = (type, value) => ({
  isToken: true,
  type,
  value,
  toString: () => `${type}`
});
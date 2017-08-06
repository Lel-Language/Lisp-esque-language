module.exports = (str) => {
  const l = (str.match(/\(/g) || []).length;
  const r = (str.match(/\)/g) || []).length;
  return (l === r)
    ? 0
    : (l > r)
      ? -1
      : 1;
};
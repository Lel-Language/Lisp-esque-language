const general = require('./general');
const boolean = require('./boolean');
const math = require('./math');
const list = require('./list');
const string = require('./string');

module.exports = Object.assign(
  {},
  general,
  boolean,
  math,
  list,
  string
);

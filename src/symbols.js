module.exports = {
  // Whitespace skips
  SKIP: 'SKIP',

  // List operator expanded in parser
  RANGE: 'RANGE',

  // Expression start/end
  LPAREN: 'LPAREN',
  RPAREN: 'RPAREN',

  // Primitives
  NUMBER: 'NUMBER',
  STRING: 'STRING',
  BOOLEAN: 'BOOLEAN',
  IDENTIFIER: 'IDENTIFIER',

  // Used internally for passing functions
  FUNCTION_REFERENCE: 'FUNCTION_REFERENCE',

  // Used internally for describing lists
  LIST: 'LIST'
};

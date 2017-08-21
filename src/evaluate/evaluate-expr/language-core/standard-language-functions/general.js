const createToken = require('../../../../create-token');
const symbols = require('../../../../symbols');

const EMPTY_STRING = createToken(symbols.STRING, '');
const EMPTY_LIST = createToken(symbols.LIST);

const prettyString = (token) => {
  if ([symbols.NUMBER, symbols.BOOLEAN, symbols.STRING].includes(token.type)) {
    return token.value.toString();
  } else if (token.type === symbols.LIST) {
    return `(${token.value.map(prettyString).join(', ')})`;
  }
  return token.toString();
};

module.exports = {
  exit: (codeToken) => {
    const code = (codeToken && codeToken.type === symbols.NUMBER)
      ? codeToken.value
      : 0;
    process.exit(code);
  },
  print: (...items) => {
    const out = items
      .map(prettyString)
      .join('');
    process.stdout.write(out);
    return Promise.resolve(createToken(symbols.STRING, out));
  },
  cls: () => {
    process.stdout.write('\033c');
    return Promise.resolve(EMPTY_LIST);
  },
  concat: (...concatables) => {
    if (concatables.length) {
      const type = concatables[0].type;
      const allSameType = concatables.filter(concatable => concatable.type !== type).length === 0;

      if (type === symbols.LIST && allSameType) {
        const concatenatedLists = concatables.reduce((acc, list) =>
          [...acc, ...list.value]
          , []
        );
        return Promise.resolve(createToken(symbols.LIST, concatenatedLists));
      } else {
        return Promise.resolve(concatables.reduce(
          (acc, cur) => {
            const next = ([symbols.STRING, symbols.NUMBER, symbols.BOOLEAN].indexOf(cur.type) !== -1)
              ? cur.value
              : cur.toString();
            return createToken(symbols.STRING, acc.value + next);
          }, EMPTY_STRING
        ));
      }
    }
    return Promise.resolve(createToken(symbols.LIST, []));
  }
};

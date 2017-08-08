const createToken = require('./create-token');
const patterns = require('./patterns');
const { SKIP, EOF } = require('./symbols');

module.exports = (inString) => {
  const tokens = [];
  const chars = inString.split('');

  let check = '';

  for (let i = 0; i < chars.length; i++) {
    check += chars[i];

    // Check against exact patterns first
    if (check.length === 1) {
      const matchedExactPattern = patterns.exact.some(ep => {
        const [exactStr, symbol] = ep;
        if (i + exactStr.length <= chars.length) {
          const exactCheck = check + chars.slice(i + 1, i + exactStr.length).join('');

          if (exactCheck === exactStr) {
            // Set the new i pointer
            i += exactStr.length - 1;

            // Add the token to the list
            if (symbol !== SKIP) {
              tokens.push(createToken(symbol, exactCheck));
            }
            // Reset the check string
            check = '';
            // Exit from the token search
            return true;
          }
        }
        return false;
      });

      if (matchedExactPattern) continue;
    }

    // Perform an ambiguous check to prioritise a pattern match
    if (check.length === 1 && i < chars.length - 1) {
      patterns.ambiguous.some(ap => {
        if (ap[0].test(check)) {
          return ap.slice(1).some(tokenPattern => {
            if (tokenPattern[0].test(check) || tokenPattern[0].test(check + chars[i + 1])) {
              check += chars[++i];
              return true;
            }
          });
        }
        return false;
      });
    }

    // Test for tokens until a sucessful one is found
    patterns.tokens.some(tr => {
      const [regex, label] = tr;

      // Test if it's a token match
      if (regex.test(check)) {
        if (i === chars.length - 1) {
          // Add the token to the list
          if (label !== SKIP) {
            tokens.push(createToken(label, check));
          }
          return true;
        }
        // Peek ahead at the next charcters while it's still matching the same token
        let peekCheck = check;
        for (let j = i + 1; j < chars.length; j++) {
          peekCheck += chars[j];

          // Does checking with another character still match?
          if (!regex.test(peekCheck)) {
            // If not, consider everything up until the last peekCheck the token
            check = peekCheck.slice(0, peekCheck.length - 1);

            // Set tokeniser index to this point
            i = j - 1;

            // Add the token to the list
            if (label !== SKIP) {
              tokens.push(createToken(label, check));
            }
            // Reset the check string
            check = '';
            // Exit from the token search
            return true;
          }
        }
      }
    });
  }

  return tokens;
};

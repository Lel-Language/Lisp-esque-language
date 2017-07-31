const createToken = require('./create-token');
const patterns = require('./patterns');
const { SKIP, EOF } = require('./symbols');

module.exports = (inString) => {
  const tokens = [];
  const chars = inString.split('');

  let check = '';

  for (let i = 0; i < chars.length; i++) {
    check += chars[i];
    // Test for tokens until a sucessful one is found
    const foundToken = patterns.some(tr => {
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

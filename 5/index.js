const crypto = require('crypto');

const input = 'reyedfim';
const test  = 'abc';

const md5 = (str) => crypto.createHash('md5').update(str).digest('hex');

function getPassword(input) {
  let result = Array.from({ length: 8 });

  let i = 0;
  while (i < 1000000000) {
    const hash = md5(`${input}${i}`);

    if (hash.startsWith('00000') && hash.charAt(5).match(/[0-7]/)) {
      if (!result[hash.charAt(5)]) result[hash.charAt(5)] = hash.charAt(6);
      if (result.every(el => el)) break;
    }

    i++;
  }

  return result.join('');
}

console.log(getPassword(input));

const crypto = require('crypto');
const algorithm = 'md5';

const input = 'ihaygndm';
const test = 'abc'; // answer 22728 (64th key index);

const cache_getNthMd5 = {};

const md5 = str => crypto.createHash('md5').update(str).digest('hex');

const getNthMd5 = (str, n) => {
  if (cache_getNthMd5[str]) {
    return cache_getNthMd5[str];
  }

  let hash = md5(str);

  for (let i = 1; i <= n; i++) {
    hash = md5(hash);
  }

  cache_getNthMd5[str] = hash;

  return hash;
}

const checkNLetters = (arr, ind, ch, n) => {
  let match = 0;

  for (let i = ind; i < ind + n; i++) {
    if (arr[i] === ch) match++;
    if (match >= n) return true;
  }

  return false;
}

const hasNLetters = (str, n, char) => {
  const arr = str.split('');

  return char ?
    arr.find((ch, ind) => {
      if (ch === char) return checkNLetters(arr, ind, ch, n);
      return false;
    })
    :
    arr.find((ch, ind) => checkNLetters(arr, ind, ch, n));
};

const checkNext1000 = (salt, char, ind) => {
  for (let i = ind; i < ind + 1000; i++) {
    const hash = getNthMd5(`${salt}${i}`, 2016);

    if (hasNLetters(hash, 5, char)) return true;
  }

  return false;
};

const isKey = (salt, ind) => {
  const hash = getNthMd5(`${salt}${ind}`, 2016);
  const tripleLetter = hasNLetters(hash, 3);

  if (tripleLetter) {
    return checkNext1000(salt, tripleLetter, ind + 1);
  } else {
    return false;
  }
};

const findNthKey = (salt, n) => {
  let i = 0;
  let keys = [];

  while (keys.length < n) {
    if (isKey(salt, i)) {
      keys.push(i);
      console.log(`${i} is ${keys.length}th key.`)
    }

    i++;
  }

  return keys[keys.length - 1];
};

console.log(findNthKey(input, 64));
// console.log(findNthKey(test, 64));

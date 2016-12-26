const alphabet = 'abcdefghijklmnopqrstuvwxyz';

const phrase = 'Fvzcry gbpu Xbz arkg-yriry glcra va Hgerpug bc baf areqxjnegvre';

const shift = (str, n) =>
  str.split('').map((ch, i) => {
    const curr = alphabet.indexOf(ch);
    return alphabet.charAt((curr + n) % 26);
  }).join('');

// for (let i = 1; i < 30; i++) {
//   console.log(shift('fvzcry', i), i);
// }

// 13

const translation = phrase.toLowerCase().split(' ').map(word =>
  shift(word, 13)).join(' ');

console.log(translation);

// Simpel toch? Kom next-level typen in Utrecht op ons nerdkwartier!

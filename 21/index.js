const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');

const regex = [
  [ /swap position (\d+) with position (\d+)/,
    match => ({ action: 'swapPosition', args: [ Number(match[1]), Number(match[2]) ] }) ],
  [ /swap letter (\w) with letter (\w)/,
    match => ({ action: 'swapLetter', args: [ match[1], match[2] ] }) ],
  [ /rotate left (\d+) steps?/,
    match => ({ action: 'rotateLeft', args: [ Number(match[1]) ] }) ],
  [ /rotate right (\d+) steps?/,
    match => ({ action: 'rotateRight', args: [ Number(match[1]) ] }) ],
  [ /rotate based on position of letter (\w)/,
    match => ({ action: 'rotateBased', args: [ match[1] ] }) ],
  [ /reverse positions (\d+) through (\d+)/,
    match => ({ action: 'reverse', args: [ Number(match[1]), Number(match[2]) ] }) ],
  [ /move position (\d+) to position (\d+)/,
    match => ({ action: 'move', args: [ Number(match[1]), Number(match[2]) ] }) ]
];

const regexMap = new Map(regex);

const parseInput = input =>
  input.trim().split('\n').map((line, ind) => {
    let handler = null;
    let match = null;

    regexMap.forEach((val, key) => {
      if (line.match(key)) {
        handler = val;
        match = line.match(key);
      }
    });

    return handler(match);
  });

const actions = {
  swapPosition: (input, a, b) =>
    input.split('').map((l, i, arr) => {
      if (i === a) return arr[b];
      if (i === b) return arr[a];
      return l;
    }).join(''),

  swapLetter: (input, a, b) =>
    input.split('').map(l => {
      if (l === a) return b;
      if (l === b) return a;
      return l;
    }).join(''),

  rotateLeft: (input, steps) =>
    input.slice(steps % input.length)
    .concat(input.slice(0, steps % input.length)),

  rotateRight: (input, steps) =>
    input.slice(-steps % input.length)
    .concat(input.slice(0, -steps % input.length)),

  rotateBased: (input, letter) =>
    actions.rotateRight(input, [
      input.indexOf(letter) + (input.indexOf(letter) >= 4 ? 2 : 1)
    ]),

  reverse: (input, start, end) =>
    input.slice(0, start) +
    input.slice(start, end + 1).split('').reverse().join('') +
    input.slice(end + 1),

  move: (input, position, target) => {
    const l = input.charAt(position);
    const arr = (input.slice(0, position) + input.slice(position + 1)).split('');
    arr.splice(target, 0, l);
    return arr.join('');
  }
};

const scramble = (input, password) => {
  const commands = parseInput(input);

  return commands.reduce((res, command) =>
    actions[command.action](res, ...command.args), password);
};

const without = (arr, elementToDrop) => arr.filter(el => el !== elementToDrop);

const getPermutations = arr => {
  function permute(arr, path = []) {
    if (arr.length === 0) permutations.push(path);

    arr.forEach((el) => {
      permute(without(arr, el), [...path, el]);
    });
  }
  const permutations = [];

  permute(arr);

  return permutations;
}

const unscramble = (input, password) =>
  getPermutations(password.split('')).find(el =>
    scramble(input, el.join('')) === password).join('');

console.log(scramble(input, 'abcdefgh'));
console.log(unscramble(input, 'fbgdceah'));

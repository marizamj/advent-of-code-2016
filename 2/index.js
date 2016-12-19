const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');
const test = `
ULL
RRDDD
LURDL
UUUUD
`;

const keypad = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

const keypad2 = [
  ['',  '',   1,  '', ''],
  ['',   2,   3,   4, ''],
  [5,    6,   7,   8,  9],
  ['', 'A', 'B', 'C', ''],
  ['',  '', 'D',  '', '']
];

const instructions = input.trim().split('\n').map(line => line.split(''));

function decode(instructions, keypad) {

  function convertLineToCoords(line, start) {
    return line.reduce((res, step) => {
      if (step === 'U' && keypad[res.y - 1] && keypad[res.y - 1][res.x])
        res.y--;
      if (step === 'D' && keypad[res.y + 1] && keypad[res.y + 1][res.x])
        res.y++;
      if (step === 'L' && keypad[res.y][res.x - 1]) res.x--;
      if (step === 'R' && keypad[res.y][res.x + 1]) res.x++;

      return res;
    }, Object.assign({}, start));
  }

  // first part
  // let start  = { x: 1, y: 1 };

  // second part
  let start = { x: 0, y: 2 };

  let result = [];
  let i = 0;

  while (i < instructions.length) {
    const newStart = convertLineToCoords(instructions[i], start);
    result.push(newStart);
    start = newStart;
    i++;
  }

  return result.map(coords => keypad[coords.y][coords.x]).join('');
}

console.log(decode(instructions, keypad2));

const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');
const test = `
5 10 25
10 10 10
12 15 67
34 56 789
321 4 59
0 9 8
`;

const groups = input.trim().split('\n')
  .map(line => line.match(/(\d+)/g).map(el => Number(el)));

function flip(matrix2d) {
  return Array.from({ length: matrix2d[0].length })
    .map((line, y) => Array.from({ length: matrix2d.length })
      .map((cell, x) => matrix2d[x][y]));
}

const groups2 = flip(groups).join(',').match(/(\d+\,\d+\,\d+)/g)
  .map(line => line.split(',').map(el => Number(el)));

function isPossibleTriangle(group) {
  const sum = group.reduce((res, el) => res + el, 0);
  return group.every(el => el < sum - el);
}

const real = groups2.map(isPossibleTriangle).filter(el => el).length;

console.log(real);
